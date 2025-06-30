import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetAllBidsResponse, GetBidModeResponse, PlaceBidResponse, SetBidModeResponse } from '../../Types/biddingTypes';
import { ProductResponse } from '../../Types/biddingTypes';

interface BiddingState {
    products: any[];
    currentProduct: ProductResponse | null;
    bids: any[];
    currentBidMode: any;
    loading: boolean;
    placingBid: boolean;
    fetchingBids: boolean;
    settingBidMode: boolean;
    fetchingBidMode: boolean;
    message: string | null;
    error: string | null;
}

const initialState: BiddingState = {
    products: [],
    currentProduct: null,
    bids: [],
    currentBidMode: null,
    loading: false,
    placingBid: false,
    fetchingBids: false,
    settingBidMode: false,
    fetchingBidMode: false,
    message: null,
    error: null,
};

const biddingSlice = createSlice({
    name: 'bidding',
    initialState,
    reducers: {
        // Fetch Specific Product Actions
        fetchSpecificProductStart: (state) => {
            state.loading = true;
            state.error = null;
            state.currentProduct = null;
        },
        // FIXED: Handle single product response, not array
        fetchSpecificProductSuccess: (state, action: PayloadAction<ProductResponse>) => {
            state.loading = false;
            // Set the single product directly
            state.currentProduct = action.payload;
            state.error = null;
            state.message = 'Product fetched successfully';
        },
        fetchSpecificProductFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.currentProduct = null;
        },

        // Place Bid Actions
        placeBidStart: (state) => {
            state.placingBid = true;
            state.error = null;
        },
        placeBidSuccess: (state, action: PayloadAction<PlaceBidResponse>) => {
            state.placingBid = false;
            state.error = null;
            state.message = action.payload.message;
            // Update current product's highest bid if it exists
            if (state.currentProduct) {
                state.currentProduct.currentHighestBid = action.payload.currentHighestBid;
            }
        },
        placeBidFailure: (state, action: PayloadAction<string>) => {
            state.placingBid = false;
            state.error = action.payload;
        },

        // Get All Bids Actions
        getAllBidsStart: (state) => {
            state.fetchingBids = true;
            state.error = null;
        },
        getAllBidsSuccess: (state, action: PayloadAction<GetAllBidsResponse>) => {
            state.fetchingBids = false;
            state.bids = action.payload.bids;
            state.error = null;
            state.message = action.payload.message;
        },
        getAllBidsFailure: (state, action: PayloadAction<string>) => {
            state.fetchingBids = false;
            state.error = action.payload;
        },

        // Set Bid Mode Actions
        setBidModeStart: (state) => {
            state.settingBidMode = true;
            state.error = null;
        },
        setBidModeSuccess: (state, action: PayloadAction<SetBidModeResponse>) => {
            state.settingBidMode = false;
            state.currentBidMode = action.payload.bidMode;
            state.error = null;
            state.message = action.payload.message;
        },
        setBidModeFailure: (state, action: PayloadAction<string>) => {
            state.settingBidMode = false;
            state.error = action.payload;
        },

        // Get Bid Mode Actions
        getBidModeStart: (state) => {
            state.fetchingBidMode = true;
            state.error = null;
        },
        getBidModeSuccess: (state, action: PayloadAction<GetBidModeResponse>) => {
            state.fetchingBidMode = false;
            state.currentBidMode = action.payload.bidMode;
            state.error = null;
            state.message = action.payload.message;
        },
        getBidModeFailure: (state, action: PayloadAction<string>) => {
            state.fetchingBidMode = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchSpecificProductStart,
    fetchSpecificProductSuccess,
    fetchSpecificProductFailure,
    placeBidStart,
    placeBidSuccess,
    placeBidFailure,
    getAllBidsStart,
    getAllBidsSuccess,
    getAllBidsFailure,
    setBidModeStart,
    setBidModeSuccess,
    setBidModeFailure,
    getBidModeStart,
    getBidModeSuccess,
    getBidModeFailure,
} = biddingSlice.actions;

export default biddingSlice.reducer;