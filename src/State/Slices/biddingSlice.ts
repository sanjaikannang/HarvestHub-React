import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BiddingState, AuctionState, BidData } from '../../Types/biddingTypes';

const initialState: BiddingState = {
    currentAuction: null,
    isConnected: false,
    isPlacingBid: false,
    isJoiningAuction: false,
    error: null,
    bidError: null,
    userBids: [],
    joinedAuctionId: null,
};

const biddingSlice = createSlice({
    name: 'bidding',
    initialState,
    reducers: {
        // Socket Connection
        setConnectionStatus: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
            if (!action.payload) {
                // Reset state when disconnected
                state.currentAuction = null;
                state.joinedAuctionId = null;
                state.error = null;
                state.bidError = null;
            }
        },

        // Auction Management
        setJoiningAuction: (state, action: PayloadAction<boolean>) => {
            state.isJoiningAuction = action.payload;
        },

        setCurrentAuction: (state, action: PayloadAction<AuctionState>) => {
            state.currentAuction = action.payload;
            state.joinedAuctionId = action.payload.productId;
            state.error = null;
        },

        updateAuctionState: (state, action: PayloadAction<AuctionState>) => {
            state.currentAuction = action.payload;
        },

        clearCurrentAuction: (state) => {
            state.currentAuction = null;
            state.joinedAuctionId = null;
            state.bidError = null;
        },

        // Bid Management
        setPlacingBid: (state, action: PayloadAction<boolean>) => {
            state.isPlacingBid = action.payload;
        },

        addUserBid: (state, action: PayloadAction<BidData>) => {
            state.userBids.unshift(action.payload);
            state.bidError = null;
        },

        // Error Management
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        setBidError: (state, action: PayloadAction<string | null>) => {
            state.bidError = action.payload;
        },

        clearErrors: (state) => {
            state.error = null;
            state.bidError = null;
        },

        // Reset entire state
        resetBiddingState: () => initialState,
    },
});

export const {
    setConnectionStatus,
    setJoiningAuction,
    setCurrentAuction,
    updateAuctionState,
    clearCurrentAuction,
    setPlacingBid,
    addUserBid,
    setError,
    setBidError,
    clearErrors,
    resetBiddingState,
} = biddingSlice.actions;

export default biddingSlice.reducer;