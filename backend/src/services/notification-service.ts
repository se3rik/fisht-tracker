import { prisma } from '../lib/prisma.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { publishLiveEvent } from './live-events.js';

export type NewNotification = {
    userId: string;
    taskId: string;
    type:
        | 'TASK_CREATED'
        | 'ASSIGNED'
        | 'UNASSIGNED'
        | 'STATUS_CHANGED'
        | 'DEADLINE_CHANGED'
        | 'COMMENT_ADDED';
    message: string;
};

export async function storeNotifications(tx: Prisma.TransactionClient, entries: NewNotification[]) {
    if (entries.length) await tx.notification.createMany({ data: entries });
}

export function publishTaskActivity(
    participants: Iterable<string>,
    notifications: NewNotification[],
) {
    publishLiveEvent(participants, 'task_changed');
    publishLiveEvent(
        notifications.map((item) => item.userId),
        'notifications_changed',
    );
}

class NotificationService {
    async list(userId: string) {
        const asOf = new Date();
        const [items, unreadCount] = await prisma.$transaction([
            prisma.notification.findMany({
                where: { userId },
                orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
                select: {
                    id: true,
                    taskId: true,
                    type: true,
                    message: true,
                    createdAt: true,
                    readAt: true,
                },
            }),
            prisma.notification.count({ where: { userId, readAt: null } }),
        ]);
        return { items, unreadCount, asOf };
    }

    async unreadCount(userId: string) {
        return {
            unreadCount: await prisma.notification.count({ where: { userId, readAt: null } }),
        };
    }

    async markRead(userId: string, through: Date) {
        await prisma.notification.updateMany({
            where: { userId, readAt: null, createdAt: { lte: through } },
            data: { readAt: new Date() },
        });
        publishLiveEvent([userId], 'notifications_changed');
        return this.unreadCount(userId);
    }
}

export default new NotificationService();
