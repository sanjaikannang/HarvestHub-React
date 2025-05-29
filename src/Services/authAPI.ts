import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse, LoginRequest, RegisterRequest } from '../Types/authTypes';


export const authAPI = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.BASE_API_URL}/auth`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/register',
                method: 'POST',
                body: userData,
            }),
        }),
    }),
});


export const {
    useLoginMutation,
    useRegisterMutation,
} = authAPI;