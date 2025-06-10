import axios from "axios";
import { GetAllProductRequest, GetAllProductResponse } from "../Types/adminTypes";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Get All Products API
export async function getAllProductsAPI(params?: GetAllProductRequest): Promise<GetAllProductResponse> {
    try {
        const queryParams = new URLSearchParams();

        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }

        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        if (params?.productStatus) {
            queryParams.append('productStatus', params.productStatus);
        }

        const url = `/product/get-all-product${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get<GetAllProductResponse>(url);

        return response.data;
    } catch (error) {
        console.error('Get all products error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to fetch products. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to fetch products. Please try again.');
    }
}