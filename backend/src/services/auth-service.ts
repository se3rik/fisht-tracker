import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../lib/prisma.js';
import mailService from '~/services/mail-service.js';
import tokenService from '~/services/token-service.js';
import { UserDto } from '~/dtos/user-dto.js';

class AuthService {
    async registration(email: string, firstName: string, secondName: string, password: string) {
        const candidate = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (candidate) {
            throw new Error(`Пользователь с почтовым адресом ${email} уже существует`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuidv4();
        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                secondName,
                activationLink,
                password: hashPassword,
            },
        });
        await mailService.sendActivationMail(email, activationLink);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }
}

export default new AuthService();
