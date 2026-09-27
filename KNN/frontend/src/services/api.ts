import axios, { type AxiosRequestConfig } from 'axios';

const baseURL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');
const client = axios.create({ baseURL, timeout: 15000, headers: { 'Content-Type': 'application/json' } });
let accessToken: string | null = null;

client.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function apiGet<T>(path: string, config?: AxiosRequestConfig) {
  const response = await client.get<{ data: T }>(path, config);
  return response.data.data;
}

export async function apiPost<T>(path: string, body?: unknown) {
  const response = await client.post<{ data: T }>(path, body);
  return response.data.data;
}

export async function apiPatch<T>(path: string, body?: unknown) {
  const response = await client.patch<{ data: T }>(path, body);
  return response.data.data;
}

export async function apiDelete<T = { removed: boolean }>(path: string) {
  const response = await client.delete<{ data: T }>(path);
  return response.data.data;
}

export function apiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error?.message;
    if (typeof message === 'string') return message;
    if (error.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
    if (!error.response) return `Could not reach ${baseURL}. Check the API address and make sure the backend is running.`;
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
