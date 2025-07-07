
import {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    fetchUsersStart,
    fetchUsersSuccess,
    fetchUsersFailure,
    fetchSpecificUserStart,
    fetchSpecificUserSuccess,
    fetchSpecificUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    reviewProductStart,
    reviewProductSuccess,
    reviewProductFailure,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFailure,
} from '../State/Slices/adminSlice';
import { AppDispatch } from '../State/store';
import { GetAllProductRequest, ReviewProductRequest } from '../Types/adminTypes';
import { deleteProductAPI, deleteUserAPI, getAllProductsAPI, getAllUsersAPI, getSpecificUserAPI, reviewProductAPI } from './adminAPI';


// Action creator for fetching products
export const fetchProducts = (filters: GetAllProductRequest) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(fetchProductsStart());
            const response = await getAllProductsAPI(filters);
            dispatch(fetchProductsSuccess(response));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
            dispatch(fetchProductsFailure(errorMessage));
        }
    };
};


// Fetch all users action
export const fetchAllUsers = (page: number = 1, limit: number = 10) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(fetchUsersStart());
            const response = await getAllUsersAPI(page, limit); // Pass pagination params
            dispatch(fetchUsersSuccess(response));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
            dispatch(fetchUsersFailure(errorMessage));
        }
    };
};


// Fetch specific user action
export const fetchSpecificUser = (userId: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(fetchSpecificUserStart());
            const response = await getSpecificUserAPI(userId);
            dispatch(fetchSpecificUserSuccess(response));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user details';
            dispatch(fetchSpecificUserFailure(errorMessage));
        }
    };
};


// Delete user action
export const deleteUser = (userId: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(deleteUserStart());
            const response = await deleteUserAPI(userId);
            dispatch(deleteUserSuccess(response));
            return response; // Return response for success handling
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
            dispatch(deleteUserFailure(errorMessage));
            throw error; // Re-throw for error handling in component
        }
    };
};


// Review product action
export const reviewProduct = (productId: string, reviewData: ReviewProductRequest) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(reviewProductStart());
            const response = await reviewProductAPI(productId, reviewData);
            dispatch(reviewProductSuccess(response));
            return response; // Return response for success handling
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to review product';
            dispatch(reviewProductFailure(errorMessage));
            throw error; // Re-throw for error handling in component
        }
    };
};


// Delete product action
export const deleteproduct = (productId: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(deleteProductStart());
            const response = await deleteProductAPI(productId);
            dispatch(deleteProductSuccess(response));
            return response; // Return response for success handling
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
            dispatch(deleteProductFailure(errorMessage));
            throw error; // Re-throw for error handling in component
        }
    };
};