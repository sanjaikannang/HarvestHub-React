
import {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
} from '../State/Slices/adminSlice';
import { AppDispatch } from '../State/store';
import { GetAllProductRequest } from '../Types/adminTypes';
import { getAllProductsAPI } from './adminAPI';

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