import type { Request, Response, NextFunction } from 'express';

import commentService from '~/services/comment-service.js';
import attachmentService from '~/services/attachment-service.js';

import { decodeFileName } from '~/middlewares/upload-middleware.js';

import ApiError from '~/exceptions/api-error.js';

class CommentController {
    async createComment(req: Request, res: Response, next: NextFunction) {
        const files = (req.files as Express.Multer.File[] | undefined) ?? [];

        try {
            const { id: taskId } = req.params;
            if (typeof taskId !== 'string') throw ApiError.BadRequest('Id задачи не указан');

            const { id: authorId } = res.locals.user;
            const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';

            if (!text && files.length === 0) {
                throw ApiError.BadRequest('Добавьте текст или прикрепите файл');
            }

            const comment = await commentService.createComment(
                taskId,
                authorId,
                text,
                files.map((file) => ({
                    fileName: decodeFileName(file.originalname),
                    storedName: file.filename,
                    mimeType: file.mimetype,
                    size: file.size,
                })),
            );

            res.status(201).json(comment);
        } catch (error) {
            // Что-то пошло не так: убираем уже сохранённые файлы, чтобы не копился мусор
            await attachmentService.removeFromDisk(files.map((file) => file.filename));
            next(error);
        }
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { commentId } = req.params;
            if (typeof commentId !== 'string')
                throw ApiError.BadRequest('Id комментария не указан');

            const { id: userId, roles } = res.locals.user;

            const comment = await commentService.deleteComment(commentId, userId, roles);
            res.json(comment);
        } catch (error) {
            next(error);
        }
    }
}

export default new CommentController();
