import type { Request, Response, NextFunction } from 'express';
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
}

export default new UserController();
