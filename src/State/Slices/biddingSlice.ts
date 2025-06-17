import { createSlice } from '@reduxjs/toolkit';

const initialState = {

};

const biddingSlice = createSlice({
    name: 'bidding',
    initialState,
    reducers: {
    },
});

export const {
} = biddingSlice.actions;

export default biddingSlice.reducer;