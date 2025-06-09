export interface ProductQuantity {
    value: number;
    unit: string;
}

export interface CreateProductRequest {
    name: string;
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