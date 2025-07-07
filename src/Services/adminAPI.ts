import axios from "axios";
import { GetAllProductRequest, ReviewProductRequest } from "../Types/adminTypes";

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

// Get All Products API
export async function getAllProductsAPI(params?: GetAllProductRequest) {
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

        const response = await apiClient.get(`/product/get-all-product?${queryParams.toString()}`);
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


// Get Specific Product API
export async function getSpecificProductAPI(productId: string) {
    try {
        const response = await apiClient.get(`/product/get-specific-product/${productId}`);
        return response.data;

    } catch (error) {
        console.error('Get specific product error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to fetch product details. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to fetch product details. Please try again.');
    }
}


// Get All Users API
export async function getAllUsersAPI(page: number = 1, limit: number = 10) {
    try {
        const response = await apiClient.get(`/user/get-all-user?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Get all Users error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to fetch Users. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to fetch Users. Please try again.');
    }
}


// Get Specific User API
export async function getSpecificUserAPI(userId: string) {
    try {
        const response = await apiClient.get(`/user/get-specific-user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Get specific user error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to fetch user details. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to fetch user details. Please try again.');
    }
}


// Delete User API
export async function deleteUserAPI(userId: string) {
    try {
        const response = await apiClient.delete(`/user/delete-user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Delete user error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to delete user. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to delete user. Please try again.');
    }
}


// Review Product API
export async function reviewProductAPI(productId: string, reviewData: ReviewProductRequest) {
    try {
        const response = await apiClient.post(`/product/review-product/${productId}`, reviewData);
        return response.data;
    } catch (error) {
        console.error('Review product error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to review product. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to review product. Please try again.');
    }
}


// Delete Product API
export async function deleteProductAPI(productId: string) {
    try {
        const response = await apiClient.delete(`/product/delete-product/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Delete product error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to delete product. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to delete product. Please try again.');
    }
}