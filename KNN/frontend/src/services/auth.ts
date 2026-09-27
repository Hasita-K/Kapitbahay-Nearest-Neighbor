import axios from 'axios';
import { apiPost } from './api';

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  token_type: string;
};

export type AuthResult = {
  user: { id: string; username?: string };
  session: AuthSession;
};

type ApiError = { error?: { message?: string } };

export const signIn = (username: string, password: string) =>
  apiPost<AuthResult>('/auth/login', { username, password });

export const signUp = (username: string, password: string, phone_number: string) =>
  apiPost<AuthResult>('/auth/signup', { username, password, phone_number });

export function authErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiError>(error)) {
    const message = error.response?.data?.error?.message;
    if (typeof message === 'string') return message;
    if (error.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
    if (!error.response) return 'Could not reach the server. Check the API address and make sure the backend is running.';
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
