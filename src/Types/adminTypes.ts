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

export interface GetSpecificProductResponse {
    message: string;
    product: ProductResponse;
}

export interface UserResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserPaginationInfo {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface GetAllUsersResponse {
    message: string;
    pagination: UserPaginationInfo;
    user: UserResponse[];
}

export interface AdminState {
    products: ProductResponse[];
    currentProduct: ProductResponse | null;
    pagination: PaginationInfo | null;
    message: string | null;
    loading: boolean;
    error: string | null;
    filters: {
        page: number;
        limit: number;
        productStatus?: string;
    };
    users: UserResponse[];
    userPagination: UserPaginationInfo | null;
    usersLoading: boolean;
    usersError: string | null;
    usersMessage: string | null;
}