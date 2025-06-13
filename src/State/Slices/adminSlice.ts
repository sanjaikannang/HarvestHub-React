import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, GetAllProductResponse, GetSpecificProductResponse } from '../../Types/adminTypes';

const initialState: AdminState = {
    products: [],
    currentProduct: null,
    pagination: null,
    loading: false,
    message: null,
    error: null,
    filters: {
        page: 1,
        limit: 10,
    },
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        // Filter actions
        setPage: (state, action: PayloadAction<number>) => {
            state.filters.page = action.payload;
        },
        setLimit: (state, action: PayloadAction<number>) => {
            state.filters.limit = action.payload;
            state.filters.page = 1; // Reset to first page when changing limit
        },
        setProductStatus: (state, action: PayloadAction<string | undefined>) => {
            state.filters.productStatus = action.payload;
            state.filters.page = 1; // Reset to first page when changing filter
        },
        resetFilters: (state) => {
            state.filters = {
                page: 1,
                limit: 10,
            };
        },

        // Async operation actions
        fetchProductsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchProductsSuccess: (state, action: PayloadAction<GetAllProductResponse>) => {
            state.loading = false;
            state.products = action.payload.product;
            state.pagination = action.payload.pagination;
            state.error = null;
            state.message = action.payload.message;
        },
        fetchProductsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Async operation actions for specific product
        fetchSpecificProductStart: (state) => {
            state.loading = true;
            state.error = null;
            state.currentProduct = null;
        },
        fetchSpecificProductSuccess: (state, action: PayloadAction<GetSpecificProductResponse>) => {
            state.loading = false;
            state.currentProduct = action.payload.product;
            state.error = null;
            state.message = action.payload.message;
        },
        fetchSpecificProductFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.currentProduct = null;
        },

        clearError: (state) => {
            state.error = null;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
    },
});

export const {
    setPage,
    setLimit,
    setProductStatus,
    resetFilters,
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    fetchSpecificProductStart,
    fetchSpecificProductSuccess,
    fetchSpecificProductFailure,
    clearError,
    clearCurrentProduct,
    clearMessage,
} = adminSlice.actions;

export default adminSlice.reducer;