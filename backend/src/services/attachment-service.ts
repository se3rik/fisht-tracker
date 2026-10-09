import fs from 'node:fs/promises';
import path from 'node:path';

import { prisma } from '../lib/prisma.js';

import { getUploadsDir } from '~/middlewares/upload-middleware.js';

import ApiError from '~/exceptions/api-error.js';

class AttachmentService {
    getFilePath(storedName: string) {
        return path.join(getUploadsDir(), path.basename(storedName));
    }

    async getById(id: string) {
        const attachment = await prisma.commentAttachment.findUnique({ where: { id } });

        if (!attachment) throw ApiError.NotFound('Файл не найден');

        return { ...attachment, path: this.getFilePath(attachment.storedName) };
    }

    async removeFromDisk(storedNames: string[]) {
        await Promise.all(
            storedNames.map((name) => fs.unlink(this.getFilePath(name)).catch(() => undefined)),
        );
    }
}

export default new AttachmentService();
