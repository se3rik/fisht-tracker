import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authApi } from '@/api';

import type { AuthResponse, LoginRequest, RegistrationRequest } from '@/api/api-types/auth';

type AuthState = {
    isAuthenticated: boolean;
    isInitialized: boolean;
    token: string | null;
    isLoading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    isAuthenticated: false,
    isInitialized: false,
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

export const logout = createAsyncThunk<{ message: string }, void, { rejectValue: string }>(
    'auth/logout',
    async function (_, { rejectWithValue }) {
        try {
            const response = await authApi.logout();

            return response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const refresh = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
    'auth/refresh',
    async function (_, { rejectWithValue }) {
        try {
            return await authApi.refresh();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        forceLogout: (state) => {
            state.isAuthenticated = false;
            state.isInitialized = true;
            state.token = null;
            state.error = null;
            state.isLoading = false;
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
            })
            // Logout
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? 'Неизвестная ошибка';
            })
            // Refresh
            .addCase(refresh.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(refresh.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.isInitialized = true;
                state.token = action.payload.accessToken;
            })
            .addCase(refresh.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isInitialized = true;
                state.token = null;
            });
    },
});

export const { forceLogout } = authSlice.actions;
export default authSlice.reducer;
