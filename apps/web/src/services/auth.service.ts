import type { LoginCredentials, RegisterCredentials } from "../types/auth.types";

export const loginUser = async ({
  email,
  password,
  rememberMe,
}: LoginCredentials): Promise<void> => {
  const response = await fetch('https://your-api.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, rememberMe }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
};

export const registerUser = async ({
  email,
  password,
  fullName,
}: RegisterCredentials): Promise<void> => {
  const response = await fetch('https://your-api.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  const data = await response.json();
};