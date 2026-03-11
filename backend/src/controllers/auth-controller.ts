import type { NextFunction, Request, Response } from 'express';

import authService from '~/services/auth-service.js';

class AuthController {
    async login(req: Request, res: Response) {}

    async registration(req: Request, res: Response, next: NextFunction) {
        try {
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
