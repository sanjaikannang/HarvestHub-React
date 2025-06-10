export interface GetAllProductRequest {
    page?: number;
    limit?: number;
    productStatus?: ProductStatus;
}

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

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface GetAllProductResponse {
    message: string;
    count: number;
    pagination: PaginationInfo;
    product: ProductResponse[];
}

export enum ProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SOLD = 'SOLD',
    EXPIRED = 'EXPIRED'
}

// Admin State Interface
export interface AdminState {
    products: ProductResponse[];
    pagination: PaginationInfo | null;
    isLoading: boolean;
    error: string | null;
    filters: {
        page: number;
        limit: number;
        productStatus?: ProductStatus;
    };
}