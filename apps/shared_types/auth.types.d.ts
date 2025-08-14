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
export interface UserEntity {
    id: number;
    email: string;
    fullName: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface JwtPayload {
    sub: number;
    email: string;
    iat?: number;
    exp?: number;
}
export interface RegisterCredentials {
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    rememberMe?: boolean;
}
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface RegisterResponse {
    accessToken: string;
    user?: {
        id: number;
        email: string;
        fullName: string;
        createdAt: string;
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
export interface User {
    id: number;
    email: string;
    fullName: string;
    createdAt: string;
}
export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}
export interface RegisterFormData {
    email: string;
    fullName: string;
    password: string;
    confirmPassword?: string;
    rememberMe: boolean;
}
export interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}
export declare const VALIDATION_RULES: {
    readonly EMAIL: {
        readonly REGEX: RegExp;
        readonly MAX_LENGTH: 254;
    };
    readonly FULL_NAME: {
        readonly MIN_LENGTH: 2;
        readonly MAX_LENGTH: 50;
        readonly REGEX: RegExp;
    };
    readonly PASSWORD: {
        readonly MIN_LENGTH: 8;
        readonly MAX_LENGTH: 128;
        readonly REGEX: RegExp;
    };
};
export interface RegisterResult {
    success: boolean;
    data?: RegisterResponse;
    error?: string;
}
