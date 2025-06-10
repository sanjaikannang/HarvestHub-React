import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, ProductStatus, ProductResponse, PaginationInfo } from '../../Types/adminTypes';

const initialState: AdminState = {
    products: [],
    pagination: null,
    isLoading: false,
    error: null,
    filters: {
        page: 1,
        limit: 10,
    }
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<AdminState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.filters.page = action.payload;
        },
        setLimit: (state, action: PayloadAction<number>) => {
            state.filters.limit = action.payload;
        },
        setProductStatusFilter: (state, action: PayloadAction<ProductStatus | undefined>) => {
            state.filters.productStatus = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {
                page: 1,
                limit: 10,
            };
        },
        clearError: (state) => {
            state.error = null;
        },
        resetProducts: (state) => {
            state.products = [];
            state.pagination = null;
        },
        setProducts: (state, action: PayloadAction<ProductResponse[]>) => {
            state.products = action.payload;
        },
        setPagination: (state, action: PayloadAction<PaginationInfo>) => {
            state.pagination = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        }
    },
});

export const {
    setFilters,
    setPage,
    setLimit,
    setProductStatusFilter,
    clearFilters,
    clearError,
    resetProducts,
    setProducts,
    setPagination,
    setLoading,
    setError
} = adminSlice.actions;

export default adminSlice.reducer;