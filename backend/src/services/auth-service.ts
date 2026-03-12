import bcrypt from 'bcrypt';

import { prisma } from '../lib/prisma.js';

import { UserDto } from '~/dtos/user-dto.js';

import tokenService from '~/services/token-service.js';

import ApiError from '~/exceptions/api-error.js';

class AuthService {
    async registration(email: string, firstName: string, secondName: string, password: string) {
        const candidate = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                secondName,
                password: hashPassword,
            },
        });

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async login(email: string, password: string) {
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден');
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
}

export default new AuthService();
