import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

import styles from './CommentAttachments.module.scss';

import { getAttachmentUrl } from '@/helpers/getAttachmentUrl';
import { formatFileSize } from '@/helpers/formatFileSize';

import type { CommentAttachment } from '@/types/comment/Commentary';

type CommentAttachmentsProps = {
    attachments: CommentAttachment[];
};

export const CommentAttachments = ({ attachments }: CommentAttachmentsProps) => {
    if (attachments.length === 0) return null;

    const images = attachments.filter((a) => a.mimeType.startsWith('image/'));
    const videos = attachments.filter((a) => a.mimeType.startsWith('video/'));
    const documents = attachments.filter(
        (a) => !a.mimeType.startsWith('image/') && !a.mimeType.startsWith('video/'),
    );

    return (
        <div className={styles.attachments}>
            {images.length > 0 && (
                <div className={styles.mediaGrid}>
                    {images.map((image) => (
                        <a
                            key={image.id}
                            href={getAttachmentUrl(image.id)}
                            target="_blank"
                            rel="noreferrer"
                            title={image.fileName}
                        >
                            <img
                                className={styles.image}
                                src={getAttachmentUrl(image.id)}
                                alt={image.fileName}
                                loading="lazy"
                            />
                        </a>
                    ))}
                </div>
            )}

            {videos.map((video) => (
                <video
                    key={video.id}
                    className={styles.video}
                    src={getAttachmentUrl(video.id)}
                    controls
                    preload="metadata"
                />
            ))}

            {documents.map((doc) => (
                <a
                    key={doc.id}
                    className={styles.document}
                    href={getAttachmentUrl(doc.id)}
                    target="_blank"
                    rel="noreferrer"
                >
                    <DescriptionOutlinedIcon fontSize="small" />
                    <span className={styles.documentName}>{doc.fileName}</span>
                    <span className={styles.documentSize}>{formatFileSize(doc.size)}</span>
                </a>
            ))}
        </div>
    );
};
