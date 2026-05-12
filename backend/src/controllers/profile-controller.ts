import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ApiError from '~/exceptions/api-error.js';
import profileService from '~/services/profile-service.js';

class ProfileController {
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = res.locals.user.id;
            const profileData = await profileService.getProfile(userId);

            return res.json(profileData);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }

            const userId = res.locals.user.id;
            const { firstName, secondName, patronymic, department, speciality } = req.body;
            const updatedProfileData = await profileService.updateProfile(userId, {
                firstName,
                secondName,
                patronymic,
                department,
                speciality,
            });

            return res.json(updatedProfileData);
        } catch (error) {
            next(error);
        }
    }
}

export default new ProfileController();
