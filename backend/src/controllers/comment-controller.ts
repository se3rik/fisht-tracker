import type { Request, Response, NextFunction } from 'express';

import commentService from '~/services/comment-service.js';

import ApiError from '~/exceptions/api-error.js';

class CommentController {
    async createComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: taskId } = req.params;
            if (!taskId) throw ApiError.BadRequest('Id задачи не указан');

            const { id: authorId } = res.locals.user;
            const { text } = req.body;

            if (!text) throw ApiError.BadRequest('Текст комментария не указан');

            const comment = await commentService.createComment(taskId as string, authorId, text);
            res.status(201).json(comment);
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { commentId } = req.params;
            if (!commentId) throw ApiError.BadRequest('Id комментария не указан');

            const { id: userId, roles } = res.locals.user;

            const comment = await commentService.deleteComment(commentId as string, userId, roles);
            res.json(comment);
        } catch (error) {
            next(error);
        }
    }
}

export default new CommentController();
