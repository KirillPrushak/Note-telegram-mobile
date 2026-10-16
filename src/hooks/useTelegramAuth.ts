import { useState } from "react";

import { telegramApi } from "@/api";
import { useAuthFlowStore, useAuthStore } from "@/store";
import { getApiErrorMessage } from "@/utils/apiError";

type Step = "userId" | "code";

const ALREADY_REQUESTED = /already requested|recently/i;
const CODE_ALREADY_SENT = "A code was already sent, check Telegram";

// Two-step Telegram sign-in (user id -> code), ported from web AuthPage.
export function useTelegramAuth() {
  // If a code was requested recently (app closed mid-flow), resume on the
  // code step. The flow store is hydrated before this screen mounts.
  const [initialUserId] = useState(() => {
    const { pendingUserId, isRequested } = useAuthFlowStore.getState();
    return pendingUserId && isRequested(pendingUserId) ? pendingUserId : null;
  });

  const [step, setStep] = useState<Step>(initialUserId ? "code" : "userId");
  const [userId, setUserId] = useState(initialUserId ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const signIn = useAuthStore((s) => s.signIn);

  const goToCodeStep = (message: string | null = null) => {
    setStep("code");
    setCode("");
    setError(null);
    setNotice(message);
  };

  // Shared by "Continue" and "Resend". Returns the outcome so
  // each caller can phrase the result for its own step.
  const sendCode = async (id: string): Promise<"sent" | "pending" | "failed"> => {
    const flow = useAuthFlowStore.getState();
    setIsRequesting(true);
    setError(null);
    setNotice(null);
    try {
      await telegramApi.requestCode({ user_id: id });
      flow.markRequested(id);
      return "sent";
    } catch (err) {
      const message = getApiErrorMessage(err, "Couldn't send the code. Try again later.");
      if (!ALREADY_REQUESTED.test(message)) {
        setError(message);
        return "failed";
      }
      // The backend's cooldown is about a code that was just spent, so
      // there is nothing to enter. Explain instead of a dead-end code step.
      if (flow.wasRecentlyUsed(id)) {
        setError("You just signed in with this ID. Wait a few minutes before requesting a new code.");
        return "failed";
      }
      flow.markRequested(id);
      return "pending";
    } finally {
      setIsRequesting(false);
    }
  };

  const submitUserId = async () => {
    const id = userId.trim();
    if (!id) return;

    if (useAuthFlowStore.getState().isRequested(id)) {
      goToCodeStep(CODE_ALREADY_SENT);
      return;
    }

    const result = await sendCode(id);
    if (result === "sent") goToCodeStep();
    if (result === "pending") goToCodeStep(CODE_ALREADY_SENT);
  };

  const resendCode = async () => {
    const result = await sendCode(userId.trim());
    if (result === "sent") setNotice("A new code was sent to Telegram");
    if (result === "pending") {
      setError("The previous code is still valid. You can request a new one in 5 minutes.");
    }
  };

  const verify = async (value: string = code) => {
    const id = userId.trim();
    if (!id || isVerifying) return;

    setIsVerifying(true);
    setError(null);
    setNotice(null);
    try {
      const response = await telegramApi.verifyCode({ code: value, user_id: id });
      const tokenData = response.data?.data;

      if (!tokenData?.token) {
        setError(response.data?.message || "Invalid code. Please try again.");
        setCode("");
        return;
      }

      useAuthFlowStore.getState().markUsed(id);
      // Flips the route guard: the root layout switches to the tabs.
      await signIn({
        token: tokenData.token,
        token_type: tokenData.token_type || "Bearer",
        expires_in: tokenData.expires_in || 3600,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid or expired code"));
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  const changeUserId = (value: string) => {
    setUserId(value);
    setError(null);
    setNotice(null);
  };

  const backToUserId = () => {
    setStep("userId");
    setCode("");
    setError(null);
    setNotice(null);
  };

  return {
    step,
    userId,
    code,
    error,
    notice,
    isRequesting,
    isVerifying,
    changeUserId,
    setCode,
    submitUserId,
    resendCode,
    verify,
    backToUserId,
  };
}
