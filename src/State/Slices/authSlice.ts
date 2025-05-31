import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../Types/authTypes';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

// Helper function to get user from localStorage
const getUserFromStorage = (): User | null => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
    }
};

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

            // Save both token and user details in localStorage
            localStorage.setItem('accessToken', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            // Remove both token and user details from localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        restoreAuthFromStorage: (state) => {
            const token = localStorage.getItem('accessToken');
            const user = getUserFromStorage();

            if (token && user) {
                state.user = user;
                state.token = token;
                state.isAuthenticated = true;
            } else {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            }
        },
    },
});


export const {
    setCredentials,
    clearCredentials,
    setLoading,
    setError,
    restoreAuthFromStorage
} = authSlice.actions;

export default authSlice.reducer;