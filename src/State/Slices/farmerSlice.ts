import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FarmerStats, Product } from "../../Types/farmerTypes";

interface FarmerState {
    // Product related state
    products: Product[];
    currentProduct: Product | null;

    // Dashboard stats
    stats: FarmerStats | null;

    // Loading states
    isLoading: boolean;
    isCreatingProduct: boolean;
    isUpdatingProduct: boolean;
    isDeletingProduct: boolean;
    isFetchingProducts: boolean;
    isFetchingDashboard: boolean;

    // Error states
    error: string | null;
    createProductError: string | null;
    updateProductError: string | null;
    deleteProductError: string | null;
    fetchProductsError: string | null;
    dashboardError: string | null;

    // Pagination
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    } | null;
}

const initialState: FarmerState = {
    products: [],
    currentProduct: null,
    stats: null,
    isLoading: false,
    isCreatingProduct: false,
    isUpdatingProduct: false,
    isDeletingProduct: false,
    isFetchingProducts: false,
    isFetchingDashboard: false,
    error: null,
    createProductError: null,
    updateProductError: null,
    deleteProductError: null,
    fetchProductsError: null,
    dashboardError: null,
    pagination: null,
};

const farmerSlice = createSlice({
    name: 'farmer',
    initialState,
    reducers: {
        // Clear errors
        clearErrors: (state) => {
            state.error = null;
            state.createProductError = null;
            state.updateProductError = null;
            state.deleteProductError = null;
            state.fetchProductsError = null;
            state.dashboardError = null;
        },

        // Set current product
        setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
            state.currentProduct = action.payload;
        },

        // Clear current product
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },

        // Reset farmer state
        resetFarmerState: (state) => {
            Object.assign(state, initialState);
        },
    },
});


export const {
    clearErrors,
    setCurrentProduct,
    clearCurrentProduct,
    resetFarmerState
} = farmerSlice.actions;

export default farmerSlice.reducer;