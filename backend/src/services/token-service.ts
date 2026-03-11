import jwt from 'jsonwebtoken';

import { prisma } from '../lib/prisma.js';

import type { JWTPayload } from '~/types/jwt.js';

class TokenService {
    generateToken(payload: JWTPayload) {
        if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '30d',
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await prisma.refreshToken.findFirst({
            where: { userId },
        });

        if (tokenData) {
            return prisma.refreshToken.update({
                where: { id: tokenData.id },
                data: { token: refreshToken },
            });
        }

        return prisma.refreshToken.create({
            data: {
                userId,
                token: refreshToken,
            },
        });
    }
}

export default new TokenService();
