export interface ProductResponse {
    _id: string;
    name: string;
    description: string;
    farmerId: string;
    quantity: {
        value: number;
        unit: string;
    };
    images: string[];
    startingPrice: number;
    currentHighestBid: number;
    bidStartDate: Date;
    bidEndDate: Date;
    bidStartTime: Date;
    bidEndTime: Date;
    productStatus: string;
}

export interface GetSpecificProductResponse {
    message: string;
    product: ProductResponse;
}

export interface Bid {
    _id: string;
    userId: string;
    userName?: string;
    bidAmount: number;
    bidTime: Date;
    productId: string;
}

export interface PlaceBidRequest {
    bidAmount: number;
}

export interface PlaceBidResponse {
    message: string;
    bid: Bid;
    currentHighestBid: number;
}

export interface GetAllBidsResponse {
    message: string;
    bids: Bid[];
    totalBids: number;
}

export interface BidMode {
    _id?: string;
    productId: string;
    bidMode: 'MANUAL' | 'AUTO';
    autoIncrementAmount?: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SetBidModeRequest {
    bidMode: 'MANUAL' | 'AUTO';
    autoIncrementAmount?: number;
}

export interface SetBidModeResponse {
    message: string;
    bidMode: BidMode;
}

export interface GetBidModeResponse {
    message: string;
    bidMode: BidMode;
}

export interface BiddingState {
    products: ProductResponse[];
    currentProduct: ProductResponse | null;
    bids: Bid[];
    currentBidMode: BidMode | null;
    loading: boolean;
    placingBid: boolean;
    fetchingBids: boolean;
    settingBidMode: boolean;
    fetchingBidMode: boolean;
    message: string | null;
    error: string | null;
}