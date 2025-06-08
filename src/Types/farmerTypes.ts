export interface ProductQuantity {
    value: number;
    unit: string;
}

export interface CreateProductRequest {
    productName: string;
    description: string;
    quantity: ProductQuantity;
    startingPrice: number;
    bidStartDate: string;
    bidEndDate: string;
    bidStartTime: string;
    bidEndTime: string;
    images: string[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    quantity: ProductQuantity;
    startingPrice: number;
    bidStartDate: string;
    bidEndDate: string;
    bidStartTime: string;
    bidEndTime: string;
    images: string[];
    farmerId: string;
    status: 'active' | 'inactive' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductResponse {
    success: boolean;
    message: string;
    data: Product;
}

export interface GetProductsResponse {
    success: boolean;
    message: string;
    data: Product[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
    id: string;
}

export interface UpdateProductResponse {
    success: boolean;
    message: string;
    data: Product;
}

export interface DeleteProductResponse {
    success: boolean;
    message: string;
}

// Farmer Dashboard Stats
export interface FarmerStats {
    totalProducts: number;
    activeProducts: number;
    completedProducts: number;
    totalRevenue: number;
    pendingBids: number;
}

export interface FarmerDashboardResponse {
    success: boolean;
    message: string;
    data: {
        stats: FarmerStats;
        recentProducts: Product[];
    };
}