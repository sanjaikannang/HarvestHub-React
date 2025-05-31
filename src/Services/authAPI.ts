import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '../Types/authTypes';


const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Register API
export async function RegisterApi(registerData: RegisterRequest): Promise<AuthResponse> {
    try {

        const response = await apiClient.post<AuthResponse>('/auth/register', registerData);

        return response.data;

    } catch (error) {
        console.log(error);

        // Extract error message from API response
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Registration failed. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Registration failed. Please try again.');
    }
}


// Login API
export async function LoginApi(loginData: LoginRequest): Promise<AuthResponse> {
    try {

        const response = await apiClient.post<AuthResponse>('/auth/login', loginData);

        return response.data;

    } catch (error) {
        console.log(error);

        // Extract error message from API response
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Login failed. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Login failed. Please try again.');
    }
}