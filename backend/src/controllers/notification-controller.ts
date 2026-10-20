import type { Request, Response, NextFunction } from 'express';
import notificationService from '~/services/notification-service.js';
import { addLiveConnection } from '~/services/live-events.js';

class NotificationController {
    async list(_req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await notificationService.list(res.locals.user.id));
        } catch (error) {
            next(error);
        }
    }

    async unreadCount(_req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await notificationService.unreadCount(res.locals.user.id));
        } catch (error) {
            next(error);
        }
    }

    async markRead(req: Request, res: Response, next: NextFunction) {
        try {
            const through = new Date(req.body?.through);
            if (Number.isNaN(through.getTime())) {
                res.status(400).json({ message: 'Некорректная дата' });
                return;
            }
            res.json(await notificationService.markRead(res.locals.user.id, through));
        } catch (error) {
            next(error);
        }
    }

    stream(_req: Request, res: Response) {
        res.status(200);
        res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();
        addLiveConnection(res.locals.user.id, res);
    }
}

export default new NotificationController();
