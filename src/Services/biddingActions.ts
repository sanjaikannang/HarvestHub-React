import { fetchSpecificProductFailure, fetchSpecificProductStart, fetchSpecificProductSuccess, getAllBidsFailure, getAllBidsStart, getAllBidsSuccess, getBidModeFailure, getBidModeStart, getBidModeSuccess, placeBidFailure, placeBidStart, placeBidSuccess, setBidModeFailure, setBidModeStart, setBidModeSuccess } from '../State/Slices/biddingSlice';
import { AppDispatch } from '../State/store';
import { PlaceBidRequest, SetBidModeRequest } from '../Types/biddingTypes';
import { getAllBidsAPI, getBidModeAPI, getSpecificProductAPI, placeBidAPI, setBidModeAPI } from './biddingAPI';


// Fetch specific product action
export const fetchSpecificProduct = (productId: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(fetchSpecificProductStart());
        const response = await getSpecificProductAPI(productId);
        dispatch(fetchSpecificProductSuccess(response.product[0]));
    } catch (error) {
        console.error('Fetch product error:', error); // Add this line
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        dispatch(fetchSpecificProductFailure(errorMessage));
    }
};


// Place bid action
export const placeBid = (productId: string, bidData: PlaceBidRequest) => async (dispatch: AppDispatch) => {
    try {
        dispatch(placeBidStart());
        const response = await placeBidAPI(productId, bidData);
        dispatch(placeBidSuccess(response));

        // Optionally refresh bids after placing a bid
        dispatch(getAllBids(productId));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        dispatch(placeBidFailure(errorMessage));
    }
};

// Get all bids action
export const getAllBids = (productId: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(getAllBidsStart());
        const response = await getAllBidsAPI(productId);
        dispatch(getAllBidsSuccess(response));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        dispatch(getAllBidsFailure(errorMessage));
    }
};

// Set bid mode action
export const setBidMode = (productId: string, bidModeData: SetBidModeRequest) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setBidModeStart());
        const response = await setBidModeAPI(productId, bidModeData);
        dispatch(setBidModeSuccess(response));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        dispatch(setBidModeFailure(errorMessage));
    }
};

// Get bid mode action
export const getBidMode = (productId: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(getBidModeStart());
        const response = await getBidModeAPI(productId);
        dispatch(getBidModeSuccess(response));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        dispatch(getBidModeFailure(errorMessage));
    }
};