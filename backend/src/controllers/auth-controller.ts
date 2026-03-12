import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import authService from '~/services/auth-service.js';

import ApiError from '~/exceptions/api-error.js';

class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const userData = await authService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { email, firstName, secondName, password } = req.body;
            const userData = await authService.registration(email, firstName, secondName, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response) {}

    async activate(req: Request, res: Response) {}

    async refresh(req: Request, res: Response) {}
}

export default new AuthController();
