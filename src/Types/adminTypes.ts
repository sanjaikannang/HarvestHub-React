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

export interface GetAllProductRequest {
    page?: number;
    limit?: number;
    productStatus?: string;
}

export interface AdminState {
    products: ProductResponse[];
    pagination: PaginationInfo | null;
    loading: boolean;
    error: string | null;
    filters: {
        page: number;
        limit: number;
        productStatus?: string;
    };
}