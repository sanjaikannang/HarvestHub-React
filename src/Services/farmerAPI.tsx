import axios from "axios";
import { CreateProductRequest, CreateProductResponse } from "../Types/farmerTypes";

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


// Create Product API
export async function createProductAPI(productData: CreateProductRequest): Promise<CreateProductResponse> {
    try {

        const response = await apiClient.post<CreateProductResponse>('/product/create-product', productData);
        return response.data;

    } catch (error) {
        console.error('Create product error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to create product. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to create product. Please try again.');
    }
}