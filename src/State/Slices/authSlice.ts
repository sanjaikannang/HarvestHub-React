import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../Types/authTypes';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('accessToken'),
    isLoading: false,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    error: null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
            localStorage.setItem('accessToken', action.payload.token);
        },
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('accessToken');
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});


export const {
    setCredentials,
    clearCredentials,
    setLoading,
    setError
} = authSlice.actions;

export default authSlice.reducer;