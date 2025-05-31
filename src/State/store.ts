import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import farmerReducer from './Slices/farmerSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,    
        farmer: farmerReducer,    
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;    