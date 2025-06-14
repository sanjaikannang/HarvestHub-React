
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
} from '../State/Slices/adminSlice';
import { AppDispatch } from '../State/store';
import { GetAllProductRequest } from '../Types/adminTypes';
import { getAllProductsAPI, getAllUsersAPI, getSpecificProductAPI } from './adminAPI';


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