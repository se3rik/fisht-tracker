import bcrypt from 'bcrypt';

import { prisma } from '../lib/prisma.js';

import { UserDto } from '~/dtos/user-dto.js';

import tokenService from '~/services/token-service.js';

import ApiError from '~/exceptions/api-error.js';

class AuthService {
    async login(email: string, password: string) {
        const user = await prisma.user.findFirst({
            where: { email },
        });
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден');
        }

        if (!user.isActive) {
            throw ApiError.Forbidden('Учётная запись заблокирована. Обратитесь к администратору');
        }

        const isPasswordEquals = await bcrypt.compare(password, user.password);
        if (!isPasswordEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }

        const userDto = new UserDto({ ...user });
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async logout(refreshToken: string) {
        const token = tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError();
        }

        const user = await prisma.user.findFirst({
            where: { id: userData.id },
        });
        if (!user || !user.isActive) {
            throw ApiError.UnauthorizedError();
        }

        const userDto = new UserDto({ ...user });
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }
}

export default new AuthService();
