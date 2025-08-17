import type { LoginCredentials, RegisterCredentials, RegisterResponse } from '../types/auth.types';

// Base URL depending on environment
const API_URL =
  import.meta.env.MODE === "production"
    ? "https://my-production-api.com" // replace with your production API
    : "http://localhost:3000";

// Helper to handle fetch requests
const handleRequest = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);

  // Try to parse JSON safely
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
};

// Login user
export const loginUser = async ({
  email,
  password,
  rememberMe,
}: LoginCredentials): Promise<void> => {
  const data = await handleRequest(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, rememberMe }),
  });

  // Store JWT token
  localStorage.setItem("token", data.token);
};

// Register user
export const registerUser = async ({
  email,
  password,
  fullName,
}: RegisterCredentials): Promise<RegisterResponse> => {
  console.log("Registering user:", { email, password, fullName });
  console.log("API URL:", API_URL);
  const data = await handleRequest(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName }),
  });
  return data;
};
