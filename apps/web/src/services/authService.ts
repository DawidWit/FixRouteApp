export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const loginUser = async ({
  email,
  password,
  rememberMe,
}: LoginCredentials): Promise<void> => {
  


  try {
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
  } catch (error: any) {
    throw error; 
  }
};
