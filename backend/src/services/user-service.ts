import { prisma } from '../lib/prisma.js';

class UserService {
    async searchUsers(query: string) {
        return prisma.user.findMany({
            where: {
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
}

export default new UserService();
