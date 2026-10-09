import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';

import ApiError from '~/exceptions/api-error.js';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 МБ
export const MAX_FILES = 5;

const MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/quicktime': '.mov',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'text/plain': '.txt',
    'text/csv': '.csv',
    'application/zip': '.zip',
    'application/x-zip-compressed': '.zip',
};

export const getUploadsDir = () => path.resolve(process.env.UPLOADS_DIR ?? './uploads');

export const decodeFileName = (name: string) => {
    if ([...name].some((char) => char.charCodeAt(0) > 0xff)) return name;

    const decoded = Buffer.from(name, 'latin1').toString('utf8');

    return decoded.includes('\uFFFD') ? name : decoded;
};

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const dir = getUploadsDir();
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        cb(null, `${crypto.randomUUID()}${MIME_TO_EXT[file.mimetype]}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
    fileFilter: (_req, file, cb) => {
        if (!(file.mimetype in MIME_TO_EXT)) {
            return cb(
                ApiError.BadRequest(
                    `Тип файла «${decodeFileName(file.originalname)}» не поддерживается`,
                ),
            );
        }

        cb(null, true);
    },
});

export const uploadCommentFiles = (req: Request, res: Response, next: NextFunction) => {
    upload.array('files', MAX_FILES)(req, res, (error: unknown) => {
        if (!error) return next();

        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return next(ApiError.BadRequest('Файл слишком большой. Максимум 50 МБ'));
            }

            if (error.code === 'LIMIT_FILE_COUNT' || error.code === 'LIMIT_UNEXPECTED_FILE') {
                return next(ApiError.BadRequest(`Можно прикрепить не более ${MAX_FILES} файлов`));
            }

            return next(ApiError.BadRequest('Не удалось загрузить файлы'));
        }

        return next(error);
    });
};
