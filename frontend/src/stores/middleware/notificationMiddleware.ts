import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';

import { addNotification } from '@/stores/slices/notificationSlice';

export const notificationMiddleware: Middleware = (storeApi) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const message = typeof action.payload === 'string' ? action.payload : 'Произошла ошибка';

        storeApi.dispatch(addNotification('error', message));
    }

    return next(action);
};
