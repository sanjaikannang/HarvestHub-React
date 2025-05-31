export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    role: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    message: string;
    refreshToken?: string;
}

export interface APIError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}