import { request } from '@/api/base';

export type Notification = {
    id: string;
    taskId: string;
    type:
        | 'TASK_CREATED'
        | 'ASSIGNED'
        | 'UNASSIGNED'
        | 'STATUS_CHANGED'
        | 'DEADLINE_CHANGED'
        | 'COMMENT_ADDED';
    message: string;
    createdAt: string;
    readAt: string | null;
};

export const notificationsApi = {
    list: () =>
        request<{ items: Notification[]; unreadCount: number; asOf: string }>('/notifications'),
    unreadCount: () => request<{ unreadCount: number }>('/notifications/unread-count'),
    markRead: (through: string) =>
        request<{ unreadCount: number }>('/notifications/read', {
            method: 'PATCH',
            body: { through },
        }),
};
