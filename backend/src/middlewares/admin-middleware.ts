import type { Request, Response, NextFunction } from 'express';

import ApiError from '~/exceptions/api-error.js';

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user || user.roles !== 'ADMIN') {
        return next(ApiError.Forbidden('Недостаточно прав'));
    }

    next();
};

export default adminMiddleware;
