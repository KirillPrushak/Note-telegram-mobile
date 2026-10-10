import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { API_CONFIG } from "./constants";
import { authStorage } from "@/lib/authStorage";
import type { ApiResponse } from "./types.interface";

type UnauthorizedHandler = () => void;

class ApiClient {
  private instance: AxiosInstance;
  // Navigation lives in the UI layer (expo-router), so the client only
  // notifies; the root layout registers what to do on 401.
  private onUnauthorized: UnauthorizedHandler | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  public setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
    this.onUnauthorized = handler;
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = authStorage.getToken();

        if (token && config.headers) {
          config.headers.Authorization = `${authStorage.getTokenType()} ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        if (response.data?.success === false) {
          return Promise.reject(new Error(response.data.message || "Request failed"));
        }
        return response;
      },
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await authStorage.clear();
          this.onUnauthorized?.();
        }

        return Promise.reject(error);
      },
    );
  }

  public get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T, AxiosResponse<T>>(url, config);
  }

  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) {
    return this.instance.post<T, AxiosResponse<T>>(url, data, config);
  }

  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) {
    return this.instance.patch<T, AxiosResponse<T>>(url, data, config);
  }

  public delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T, AxiosResponse<T>>(url, config);
  }
}

export const apiClient = new ApiClient();
