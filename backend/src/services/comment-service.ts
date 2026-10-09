import { prisma } from '../lib/prisma.js';

import attachmentService from '~/services/attachment-service.js';

import ApiError from '~/exceptions/api-error.js';

type NewAttachment = {
    fileName: string;
    storedName: string;
    mimeType: string;
    size: number;
};

class CommentService {
    async createComment(
        taskId: string,
        authorId: string,
        text: string,
        attachments: NewAttachment[] = [],
    ) {
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) throw ApiError.NotFound('Задача не найдена');

        return prisma.comment.create({
            data: {
                taskId,
                authorId,
                text,
                ...(attachments.length > 0 && { attachments: { create: attachments } }),
            },
            include: {
                author: { select: { id: true, firstName: true, secondName: true } },
                attachments: {
                    select: { id: true, fileName: true, mimeType: true, size: true },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }

    async deleteComment(commentId: string, userId: string, userRole: string) {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: { attachments: { select: { storedName: true } } },
        });
        if (!comment) throw ApiError.NotFound('Комментарий не найден');

        const isAuthor = comment.authorId === userId;
        const isAdmin = userRole === 'ADMIN';

        if (!isAuthor && !isAdmin) {
            throw ApiError.Forbidden('Недостаточно прав для удаления комментария');
        }

        // Строки о вложениях в базе удалятся каскадно вместе с комментарием
        const deleted = await prisma.comment.delete({ where: { id: commentId } });

        // А сами файлы с диска нужно удалить вручную
        await attachmentService.removeFromDisk(comment.attachments.map((a) => a.storedName));

        return deleted;
    }
}

export default new CommentService();
