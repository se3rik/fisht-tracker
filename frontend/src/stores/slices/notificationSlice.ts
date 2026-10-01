import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AppNotification, NotificationType } from '@/types/notification/Notification';

type NotificationState = {
    items: AppNotification[];
};

const initialState: NotificationState = {
    items: [],
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: {
            reducer: (state, action: PayloadAction<AppNotification>) => {
                state.items.push(action.payload);
            },
            prepare: (type: NotificationType, message: string) => ({
                payload: {
                    id: crypto.randomUUID(),
                    type,
                    message,
                },
            }),
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
