import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, DeleteProductResponse, DeleteUserResponse, GetAllProductResponse, GetAllUsersResponse, GetSpecificProductResponse, GetSpecificUserResponse, ReviewProductResponse } from '../../Types/adminTypes';

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
    users: [],
    userPagination: null,
    usersLoading: false,
    usersError: null,
    usersMessage: null,
    specificUser: null,
    specificUserLoading: false,
    specificUserError: null,
    deleteUserLoading: false,
    deleteUserError: null,
    deleteProductLoading: false,
    deleteProductError: null,
    reviewProductLoading: false,
    reviewProductError: null,
    reviewProductMessage: null,
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

        // User actions
        fetchUsersStart: (state) => {
            state.usersLoading = true;
            state.usersError = null;
        },
        fetchUsersSuccess: (state, action: PayloadAction<GetAllUsersResponse>) => {
            state.usersLoading = false;
            state.users = action.payload.user;
            state.userPagination = action.payload.pagination;
            state.usersError = null;
            state.usersMessage = action.payload.message;
        },
        fetchUsersFailure: (state, action: PayloadAction<string>) => {
            state.usersLoading = false;
            state.usersError = action.payload;
        },

        // Specific user actions
        fetchSpecificUserStart: (state) => {
            state.specificUserLoading = true;
            state.specificUserError = null;
            state.specificUser = null;
        },
        fetchSpecificUserSuccess: (state, action: PayloadAction<GetSpecificUserResponse>) => {
            state.specificUserLoading = false;
            state.specificUser = action.payload.user[0]; // API returns array, take first element
            state.specificUserError = null;
        },
        fetchSpecificUserFailure: (state, action: PayloadAction<string>) => {
            state.specificUserLoading = false;
            state.specificUserError = action.payload;
            state.specificUser = null;
        },

        // Delete user actions
        deleteUserStart: (state) => {
            state.deleteUserLoading = true;
            state.deleteUserError = null;
        },
        deleteUserSuccess: (state, action: PayloadAction<DeleteUserResponse>) => {
            state.deleteUserLoading = false;
            state.deleteUserError = null;
            state.usersMessage = action.payload.message;
        },
        deleteUserFailure: (state, action: PayloadAction<string>) => {
            state.deleteUserLoading = false;
            state.deleteUserError = action.payload;
        },


        // Delete product actions
        deleteProductStart: (state) => {
            state.deleteProductLoading = true;
            state.deleteProductError = null;
        },
        deleteProductSuccess: (state, action: PayloadAction<DeleteProductResponse>) => {
            state.deleteProductLoading = false;
            state.deleteProductError = null;
            state.usersMessage = action.payload.message;
        },
        deleteProductFailure: (state, action: PayloadAction<string>) => {
            state.deleteProductLoading = false;
            state.deleteProductError = action.payload;
        },

        // Product review actions
        reviewProductStart: (state) => {
            state.reviewProductLoading = true;
            state.reviewProductError = null;
            state.reviewProductMessage = null;
        },
        reviewProductSuccess: (state, action: PayloadAction<ReviewProductResponse>) => {
            state.reviewProductLoading = false;
            state.reviewProductError = null;
            state.reviewProductMessage = action.payload.message;
            // Update current product if it exists
            if (action.payload.product && state.currentProduct) {
                state.currentProduct = action.payload.product;
            }
        },
        reviewProductFailure: (state, action: PayloadAction<string>) => {
            state.reviewProductLoading = false;
            state.reviewProductError = action.payload;
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
        clearUsersError: (state) => {
            state.usersError = null;
        },
        clearUsersMessage: (state) => {
            state.usersMessage = null;
        },
        clearSpecificUser: (state) => {
            state.specificUser = null;
        },
        clearSpecificUserError: (state) => {
            state.specificUserError = null;
        },
        clearDeleteUserError: (state) => {
            state.deleteUserError = null;
        },
        clearDeleteProductError: (state) => {
            state.deleteProductError = null;
        },
        clearReviewProductError: (state) => {
            state.reviewProductError = null;
        },
        clearReviewProductMessage: (state) => {
            state.reviewProductMessage = null;
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
    fetchUsersStart,
    fetchUsersSuccess,
    fetchUsersFailure,
    fetchSpecificUserStart,
    fetchSpecificUserSuccess,
    fetchSpecificUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFailure,
    reviewProductStart,
    reviewProductSuccess,
    reviewProductFailure,
    clearError,
    clearCurrentProduct,
    clearMessage,
    clearUsersError,
    clearUsersMessage,
    clearSpecificUser,
    clearSpecificUserError,
    clearDeleteUserError,
    clearReviewProductError,
    clearReviewProductMessage,
} = adminSlice.actions;

export default adminSlice.reducer;