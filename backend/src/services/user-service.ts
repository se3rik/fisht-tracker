import bcrypt from 'bcrypt';

import { prisma } from '../lib/prisma.js';

import { UserDto } from '~/dtos/user-dto.js';

import ApiError from '~/exceptions/api-error.js';

import type { Department, Specialty, UserRole } from '../../generated/prisma/enums.js';

class UserService {
    async searchUsers(query: string) {
        return prisma.user.findMany({
            where: {
                isActive: true,
                OR: [
                    { firstName: { contains: query, mode: 'insensitive' } },
                    { secondName: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                firstName: true,
                secondName: true,
                department: true,
                speciality: true,
            },
            take: 10,
        });
    }

    async createUser(data: {
        email: string;
        firstName: string;
        secondName: string;
        patronymic?: string;
        password: string;
        department?: Department;
        specialty?: Specialty;
        roles?: UserRole;
    }) {
        const candidate = await prisma.user.findUnique({ where: { email: data.email } });

        if (candidate) {
            throw ApiError.BadRequest(
                `Пользователь с почтовым адресом ${data.email} уже существует`,
            );
        }

        const hashPassword = await bcrypt.hash(data.password, 3);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                firstName: data.firstName,
                secondName: data.secondName,
                patronymic: data.patronymic,
                password: hashPassword,
                department: data.department,
                speciality: data.specialty,
                roles: data.roles ?? 'USER',
            },
        });

        return new UserDto(user);
    }

    async updateUser(
        id: string,
        data: Partial<{
            firstName: string;
            secondName: string;
            patronymic: string | null;
            department: Department | null;
            specialty: Specialty | null;
            roles: UserRole;
        }>,
    ) {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }

        const updated = await prisma.user.update({
            where: { id },
            data: {
                firstName: data.firstName,
                secondName: data.secondName,
                patronymic: data.patronymic,
                department: data.department,
                speciality: data.specialty,
                roles: data.roles,
            },
        });

        return new UserDto(updated);
    }

    async resetPassword(id: string, newPassword: string) {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }

        const hashPassword = await bcrypt.hash(newPassword, 3);

        await prisma.user.update({
            where: { id },
            data: { password: hashPassword },
        });

        await prisma.refreshToken.deleteMany({ where: { userId: id } });

        return { message: 'Пароль обновлён' };
    }

    async blockUser(id: string, currentAdminId: string) {
        if (id === currentAdminId) {
            throw ApiError.BadRequest('Нельзя заблокировать самого себя');
        }

        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }

        const updated = await prisma.user.update({
            where: { id },
            data: { isActive: false },
        });

        await prisma.refreshToken.deleteMany({ where: { userId: id } });

        return new UserDto(updated);
    }

    async unblockUser(id: string) {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }

        const updated = await prisma.user.update({
            where: { id },
            data: { isActive: true },
        });

        return new UserDto(updated);
    }
}

export default new UserService();
