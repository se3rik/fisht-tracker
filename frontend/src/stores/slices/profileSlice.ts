import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { profileApi } from '@/api/profile.api';

import type { ProfileDataResponse, UpdateProfileRequest } from '@/api/api-types/profile';

type ProfileState = {
    profileData: ProfileDataResponse | null;
    isLoading: boolean;
    error: string | null;
};

const initialState: ProfileState = {
    profileData: null,
    isLoading: false,
    error: null,
};

export const getProfileData = createAsyncThunk<ProfileDataResponse, void, { rejectValue: string }>(
    'profile/getProfileData',
    async function (_, { rejectWithValue }) {
        try {
            const data = await profileApi.getProfileData();

            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const updateProfileData = createAsyncThunk<
    ProfileDataResponse,
    UpdateProfileRequest,
    { rejectValue: string }
>('profile/updateProfileData', async function (data, { rejectWithValue }) {
    try {
        const newProfileData = await profileApi.updateProfileData(data);

        return newProfileData;
    } catch (error) {
        return rejectWithValue((error as Error).message);
    }
});

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Get Profile
        builder.addCase(getProfileData.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getProfileData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.profileData = action.payload;
        });
        builder.addCase(getProfileData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload ?? 'Неизвестна ошибка';
        });
        // Update Profile
        builder.addCase(updateProfileData.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateProfileData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.profileData = action.payload;
        });
        builder.addCase(updateProfileData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload ?? 'Неизвестна ошибка';
        });
    },
});

// export const { } = profileSlice.actions;
export default profileSlice.reducer;
