import { prisma } from '../lib/prisma.js';

import { ProfileDto } from '~/dtos/profile-dto.js';

import ApiError from '~/exceptions/api-error.js';

import type { UpdateProfileData } from '~/types/updateProfileData.js';

class ProfileService {
    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }

        return new ProfileDto(user);
    }

    async updateProfile(userId: string, data: UpdateProfileData) {
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data,
        });

        return new ProfileDto(user);
    }
}

export default new ProfileService();
