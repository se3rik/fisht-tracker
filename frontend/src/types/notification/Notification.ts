export type NotificationType = 'success' | 'error' | 'info';

export type AppNotification = {
    id: string;
    type: NotificationType;
    message: string;
};
