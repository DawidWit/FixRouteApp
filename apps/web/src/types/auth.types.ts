export interface AuthResponse {

    accessToken: string;

    user?: {

        id: number;

        email: string;

        fullName: string;

        createdAt: Date;

    };

}



// Database User Entity (for internal use)

export interface UserEntity {

    id: number;

    email: string;

    fullName: string;

    password: string;

    createdAt: Date;

    updatedAt: Date;

}



// JWT Payload

export interface JwtPayload {

    sub: number; // user id

    email: string;

    iat?: number;

    exp?: number;

}



// ===== FRONTEND TYPES =====



// Request types (what frontend sends)

export interface RegisterCredentials {

    email: string;

    fullName: string;

    password: string;

    confirmPassword: string;

    rememberMe?: boolean; // Optional on frontend

}



export interface LoginCredentials {

    email: string;

    password: string;

    rememberMe?: boolean;

}



// Response types (what frontend receives)

export interface RegisterResponse {

    accessToken: string;

    user?: {

        id: number;

        email: string;

        fullName: string;

        createdAt: string; // ISO string from API

    };

}



export interface LoginResponse {

    accessToken: string;

    user?: {

        id: number;

        email: string;

        fullName: string;

        createdAt: string;

    };

}



// Auth Context types

export interface AuthContextType {

    isAuthenticated: boolean;

    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;

    register: (credentials: RegisterCredentials) => Promise<{

        success: boolean;

        data?: RegisterResponse;

        error?: string;

    }>;

}



// User state in frontend

export interface User {

    id: number;

    email: string;

    fullName: string;

    createdAt: string;

}



// API Error response structure

export interface ApiError {
    message: string;
    statusCode: number;

    error?: string;

}



// Form validation types (for frontend forms)

export interface RegisterFormData {

    email: string;
    fullName: string;
    password: string;

    confirmPassword?: string; // Only needed in forms

    rememberMe: boolean;

}



export interface LoginFormData {

    email: string;

    password: string;

    rememberMe: boolean;

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

        REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,

    },

} as const;



export interface RegisterResult {
    success: boolean;
    data?: RegisterResponse;
    error?: string;
}