export interface AuthDto {
  email: string;
  fullName: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user?: {
    id: number;
    email: string;
    fullName: string;
    createdAt: Date;
  };
}

// Validation constraints (shared between frontend and backend)
export const VALIDATION_RULES = {
  EMAIL: {
    REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    MAX_LENGTH: 254,
  },
  FULL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    REGEX: /^[a-zA-ZÀ-ÿ\s'-]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
} as const;
