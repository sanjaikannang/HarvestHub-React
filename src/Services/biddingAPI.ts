import axios from "axios";
import { PlaceBidRequest, SetBidModeRequest } from "../Types/biddingTypes";

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


// Place Bid API
export async function placeBidAPI(productId: string, bidData: PlaceBidRequest) {
    try {
        const response = await apiClient.post(`/product/place-bid/${productId}`, bidData);
        return response.data;
    } catch (error) {
        console.error('Place Bid product error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to Place Bid. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to Place Bid. Please try again.');
    }
}


// Get All Bids API
export async function getAllBidsAPI(productId: string) {
    try {
        const response = await apiClient.get(`/product/get-all-bids/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Get All Bids of a Product error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to Get All Bids of a Product. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to Get All Bids of a Product. Please try again.');
    }
}


// Set Bid Mode API
export async function setBidModeAPI(productId: string, bidModeData: SetBidModeRequest) {
    try {
        const response = await apiClient.put(`/product/set-bid-mode/${productId}`, bidModeData);
        return response.data;
    } catch (error) {
        console.error('Set BidMode for a Product error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to Set BidMode for a Product. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to Set BidMode for a Product. Please try again.');
    }
}


// Get Bid Mode API
export async function getBidModeAPI(productId: string) {
    try {
        const response = await apiClient.get(`/product/get-bid-mode/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Get BidMode for a Product error:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to Get BidMode for a Product. Please try again.';
            throw new Error(errorMessage);
        }

        throw new Error('Failed to Get BidMode for a Product. Please try again.');
    }
}