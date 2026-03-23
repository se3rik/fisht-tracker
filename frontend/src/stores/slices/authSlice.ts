import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authApi } from '@/api';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, LoginRequest, RegistrationRequest } from '@/api/api-types/auth';

type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    isLoading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    isLoading: false,
    error: null,
};

export const registration = createAsyncThunk<
    AuthResponse,
    RegistrationRequest,
    { rejectValue: string }
>('auth/registration', async function (data, { rejectWithValue }) {
    try {
        const response = await authApi.registration(
            data.email,
            data.firstName,
            data.secondName,
            data.password,
        );

        return response;
    } catch (error) {
        return rejectWithValue((error as Error).message);
    }
});

export const login = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
    'auth/login',
    async function (data, { rejectWithValue }) {
        try {
            const response = await authApi.login(data.email, data.password);

            return response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<string>) {
            state.isAuthenticated = true;
            state.token = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Registration
            .addCase(registration.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registration.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.accessToken;
            })
            .addCase(registration.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? 'Неизвестная ошибка';
            })
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.accessToken;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? 'Неизвестная ошибка';
            });
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
