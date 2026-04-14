import { prisma } from '../lib/prisma.js';
import ApiError from '~/exceptions/api-error.js';

class CommentService {
    async createComment(taskId: string, authorId: string, text: string) {
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) throw ApiError.NotFound('Задача не найдена');

        return prisma.comment.create({
            data: { taskId, authorId, text },
            include: {
                author: { select: { id: true, firstName: true, secondName: true } },
            },
        });
    }

    async deleteComment(commentId: string, userId: string, userRole: string) {
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) throw ApiError.NotFound('Комментарий не найден');

        const isAuthor = comment.authorId === userId;
        const isAdmin = userRole === 'ADMIN';

        if (!isAuthor && !isAdmin) {
            throw ApiError.Forbidden('Недостаточно прав для удаления комментария');
        }

        return prisma.comment.delete({ where: { id: commentId } });
    }
}

export default new CommentService();
