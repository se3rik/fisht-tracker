import { useCallback } from 'react';

import { useAppDispatch } from '@/hooks/useAppDispatch';

import { addNotification } from '@/stores/slices/notificationSlice';

import type { NotificationType } from '@/types/notification/Notification';

export const useNotify = () => {
    const dispatch = useAppDispatch();

    return useCallback(
        (type: NotificationType, message: string) => {
            dispatch(addNotification(type, message));
        },
        [dispatch],
    );
};
