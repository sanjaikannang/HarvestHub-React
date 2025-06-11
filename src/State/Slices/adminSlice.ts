import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, GetAllProductResponse } from '../../Types/adminTypes';

const initialState: AdminState = {
    products: [],
    pagination: null,
    loading: false,
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
        },
        fetchProductsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
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
    clearError,
} = adminSlice.actions;

export default adminSlice.reducer;