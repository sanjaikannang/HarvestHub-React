
import {
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
    reviewProductStart,
    reviewProductSuccess,
    reviewProductFailure,
} from '../State/Slices/adminSlice';
import { AppDispatch } from '../State/store';
import { GetAllProductRequest, ReviewProductRequest } from '../Types/adminTypes';
import { deleteUserAPI, getAllProductsAPI, getAllUsersAPI, getSpecificProductAPI, getSpecificUserAPI, reviewProductAPI } from './adminAPI';


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


// Fetch specific product action
export const fetchSpecificProduct = (productId: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(fetchSpecificProductStart());
        const response = await getSpecificProductAPI(productId);
        dispatch(fetchSpecificProductSuccess(response));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        dispatch(fetchSpecificProductFailure(errorMessage));
    }
};


// Fetch all users action
export const fetchAllUsers = () => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(fetchUsersStart());
            const response = await getAllUsersAPI();
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