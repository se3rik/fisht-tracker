import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import notificationReducer from './slices/notificationSlice';

import { notificationMiddleware } from './middleware/notificationMiddleware';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        notification: notificationReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(notificationMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
