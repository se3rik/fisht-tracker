import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import userService from '~/services/user-service.js';
import ApiError from '~/exceptions/api-error.js';

class UserController {
    async searchUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const { query } = req.query;
            if (!query) throw ApiError.BadRequest('Поисковый запрос не указан');

            const users = await userService.searchUsers(query as string);
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const user = await userService.createUser(req.body);
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (typeof id !== 'string') {
                return next(ApiError.BadRequest('Некорректный id пользователя'));
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }

            const user = await userService.updateUser(id, req.body);
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (typeof id !== 'string') {
                return next(ApiError.BadRequest('Некорректный id пользователя'));
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }

            const result = await userService.resetPassword(id, req.body.password);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async blockUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (typeof id !== 'string') {
                return next(ApiError.BadRequest('Некорректный id пользователя'));
            }

            const currentAdminId = res.locals.user.id;
            const user = await userService.blockUser(id, currentAdminId);
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async unblockUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (typeof id !== 'string') {
                return next(ApiError.BadRequest('Некорректный id пользователя'));
            }

            const user = await userService.unblockUser(id);
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
