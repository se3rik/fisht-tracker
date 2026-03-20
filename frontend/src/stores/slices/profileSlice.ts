import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProfileData, ProfileState } from '@/types/profile';

const initialState: ProfileState = {
    profileData: {
        firstName: 'Сергей',
        lastName: 'Рындин',
        patronymic: 'Иванович',
        email: 'se3rik@mail.ru',
    },
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileInfo: (state, action: PayloadAction<ProfileData>) => {
            state.profileData = action.payload;
        },
    },
});

export const { setProfileInfo } = profileSlice.actions;
export default profileSlice.reducer;
