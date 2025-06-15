import axios from "axios";
import { AuctionState, BidData } from "../Types/biddingTypes";

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

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface ProductData {
    _id: string;
    name: string;
    description: string;
    startingPrice: number;
    currentHighestBid?: number;
    currentHighestBidderId?: string;
    bidStartDate: string;
    bidEndDate: string;
    bidStartTime: string;
    bidEndTime: string;
    farmerId: string;
    category: string;
    location: string;
    images?: string[];
}

export interface GetAuctionStateResponse {
    success: boolean;
    data: AuctionState;
    message?: string;
}

export interface GetProductResponse {
    success: boolean;
    data: ProductData;
    message?: string;
}

export interface GetUserBidsResponse {
    success: boolean;
    data: BidData[];
    message?: string;
}

export const biddingAPI = {
    // Get auction state for a specific product
    async getAuctionState(productId: string): Promise<AuctionState> {
        try {
            const response = await apiClient.get<GetAuctionStateResponse>(`/api/bidding/auction/${productId}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to get auction state');
        } catch (error) {
            console.error('Error getting auction state:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to get auction state');
            }
            throw error;
        }
    },

    // Get product details
    async getProduct(productId: string): Promise<ProductData> {
        try {
            const response = await apiClient.get<GetProductResponse>(`/api/products/${productId}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to get product');
        } catch (error) {
            console.error('Error getting product:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to get product');
            }
            throw error;
        }
    },

    // Get user's bid history
    async getUserBids(userId?: string): Promise<BidData[]> {
        try {
            const endpoint = userId ? `/api/bidding/user-bids/${userId}` : '/api/bidding/my-bids';
            const response = await apiClient.get<GetUserBidsResponse>(endpoint);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to get user bids');
        } catch (error) {
            console.error('Error getting user bids:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to get user bids');
            }
            throw error;
        }
    },

    // Get all active auctions
    async getActiveAuctions(): Promise<AuctionState[]> {
        try {
            const response = await apiClient.get<{ success: boolean; data: AuctionState[] }>('/api/bidding/active-auctions');
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error('Failed to get active auctions');
        } catch (error) {
            console.error('Error getting active auctions:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to get active auctions');
            }
            throw error;
        }
    },

    // Validate bid amount (client-side validation before placing bid)
    async validateBid(productId: string, bidAmount: number): Promise<{ valid: boolean; message?: string }> {
        try {
            const auctionState = await this.getAuctionState(productId);
            
            // Check if auction is active
            if (!auctionState.isActive) {
                return { valid: false, message: 'Auction is not currently active' };
            }

            // Check if bid amount is higher than current highest bid
            const minimumBid = auctionState.currentHighestBid || auctionState.startingPrice;
            if (bidAmount <= minimumBid) {
                return { 
                    valid: false, 
                    message: `Bid amount must be higher than current highest bid of $${minimumBid}` 
                };
            }

            return { valid: true };
        } catch (error) {
            return { valid: false, message: 'Failed to validate bid' };
        }
    },

    // Get auction statistics
    async getAuctionStats(productId: string): Promise<{
        totalBids: number;
        uniqueBidders: number;
        averageBidAmount: number;
        bidHistory: Array<{
            bidAmount: number;
            bidTime: string;
            bidderName: string;
        }>;
    }> {
        try {
            const response = await apiClient.get(`/api/bidding/auction-stats/${productId}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to get auction stats');
        } catch (error) {
            console.error('Error getting auction stats:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to get auction stats');
            }
            throw error;
        }
    }
};

export default biddingAPI;