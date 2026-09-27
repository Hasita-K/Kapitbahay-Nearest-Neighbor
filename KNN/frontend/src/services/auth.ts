import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ''),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

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

type AuthResponse = { data: AuthResult };

export async function signIn(username: string, password: string): Promise<AuthResult> {
  const response = await api.post<AuthResponse>('/auth/login', { username, password });
  return response.data.data;
}

export async function signUp(
  username: string,
  password: string,
  phone_number: string,
): Promise<AuthResult> {
  const response = await api.post<AuthResponse>('/auth/signup', {
    username,
    password,
    phone_number,
  });
  return response.data.data;
}

export function authErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.error?.message;
    if (typeof backendMessage === 'string') return backendMessage;
    if (error.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
    if (!error.response) return 'Could not reach the server. Check the API address and make sure the backend is running.';
  }
  return 'Something went wrong. Please try again.';
}
