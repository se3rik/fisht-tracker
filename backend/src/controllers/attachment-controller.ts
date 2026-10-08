import type { Request, Response, NextFunction } from 'express';

import attachmentService from '~/services/attachment-service.js';

import ApiError from '~/exceptions/api-error.js';

const encodeFileName = (name: string) =>
    encodeURIComponent(name).replace(
        /['()*]/g,
        (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
    );

class AttachmentController {
    async getFile(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (typeof id !== 'string') {
                return next(ApiError.BadRequest('Некорректный id файла'));
            }

            const file = await attachmentService.getById(id);

            const isInline =
                file.mimeType.startsWith('image/') ||
                file.mimeType.startsWith('video/') ||
                file.mimeType === 'application/pdf';

            res.setHeader('Content-Type', file.mimeType);
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.setHeader('Cache-Control', 'private, max-age=86400');
            res.setHeader(
                'Content-Disposition',
                `${isInline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeFileName(file.fileName)}`,
            );

            res.sendFile(file.path, { dotfiles: 'allow' }, (error) => {
                if (error && !res.headersSent) {
                    next(ApiError.NotFound('Файл не найден'));
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AttachmentController();
