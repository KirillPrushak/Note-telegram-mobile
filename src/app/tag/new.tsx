import { router } from "expo-router";

import { TagCreateForm } from "@/components/features/tags/tagCreateForm";
import { FormScreen } from "@/components/layout/formScreen";

export default function NewTagScreen() {
  return (
    <FormScreen>
      <TagCreateForm onCreated={() => router.back()} />
    </FormScreen>
  );
}
