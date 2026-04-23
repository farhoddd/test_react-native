import axios from 'axios';

import { bootstrapDeviceUserId } from '../auth/device-user';
import type { ApiError } from '../types/api';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://k8s.mectest.ru/test-app';

export class ApiClientError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

function logWebNetworkError(error: unknown) {
  if (typeof window === 'undefined') {
    return;
  }

  if (axios.isAxiosError(error)) {
    console.error('[apiClient] Web request failed', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      method: error.config?.method,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullUrl: `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`,
      hasAuthorizationHeader: Boolean(error.config?.headers?.Authorization),
      responseData: error.response?.data,
      responseHeaders: error.response?.headers,
      requestPresent: Boolean(error.request),
    });
    return;
  }

  console.error('[apiClient] Non-axios web error', error);
}

apiClient.interceptors.request.use(async (config) => {
  const userId = await bootstrapDeviceUserId();

  if (userId) {
    config.headers.Authorization = `Bearer ${userId}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logWebNetworkError(error);

    const status = error.response?.status as number | undefined;
    const payload = error.response?.data as ApiError | undefined;

    if (payload?.error?.message) {
      throw new ApiClientError(payload.error.message, payload.error.code, status);
    }

    throw new ApiClientError('Сервис временно недоступен', 'UNKNOWN_ERROR', status);
  },
);
