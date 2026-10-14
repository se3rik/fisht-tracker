import type { Request, Response, NextFunction } from 'express';
import { Department } from '../../generated/prisma/enums.js';
import goalService from '~/services/goal-service.js';
import ApiError from '~/exceptions/api-error.js';

class GoalController {
    async list(_req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await goalService.list());
        } catch (error) {
            next(error);
        }
    }

    async taskOptions(req: Request, res: Response, next: NextFunction) {
        try {
            const department = String(req.query.department);
            if (!Object.values(Department).includes(department as Department)) {
                throw ApiError.BadRequest('Укажите отдел');
            }
            res.json(await goalService.taskOptions(department as Department));
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(201).json(await goalService.create(res.locals.user.id, req.body ?? {}));
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await goalService.update(res.locals.user.id, String(req.params.id), req.body ?? {}));
        } catch (error) {
            next(error);
        }
    }
}

export default new GoalController();
