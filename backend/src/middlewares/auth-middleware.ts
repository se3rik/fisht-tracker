import type { Request, Response, NextFunction } from 'express';

import { prisma } from '../lib/prisma.js';

import tokenService from '~/services/token-service.js';

import ApiError from '~/exceptions/api-error.js';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const [type, token] = authorizationHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(token);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        const user = await prisma.user.findUnique({
            where: { id: userData.id },
            select: { isActive: true },
        });

        if (!user || !user.isActive) {
            return next(ApiError.UnauthorizedError());
        }

        res.locals.user = userData;
        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError());
    }
};

export default authMiddleware;
