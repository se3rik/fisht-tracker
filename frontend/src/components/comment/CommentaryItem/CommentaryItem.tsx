import { Avatar, IconButton, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { CommentAttachments } from '@/components/comment/CommentAttachments/CommentAttachments';

import styles from './CommentaryItem.module.scss';

import { stringAvatar } from '@/helpers/stringAvatar';
import { formatDateTime } from '@/helpers/formatDate';

import type { Commentary } from '@/types/comment/Commentary';

type CommentaryItemProps = {
    comment: Commentary;
    canDelete: boolean;
    onDelete: () => void;
};

export const CommentaryItem = ({ comment, canDelete, onDelete }: CommentaryItemProps) => {
    const author = `${comment.author.firstName} ${comment.author.secondName}`;

    return (
        <>
            <Avatar {...stringAvatar(author)} sx={{ width: 38, height: 38, fontSize: 14 }} />
            <div className={styles.commentInfo}>
                <div className={styles.commentTitle}>
                    <span className={styles.commentAuthor}>{author}</span>
                    <span className={styles.commentDate}>{formatDateTime(comment.createdAt)}</span>
                </div>
                {comment.text && <p className={styles.commentText}>{comment.text}</p>}
                <CommentAttachments attachments={comment.attachments} />
            </div>
            {canDelete && (
                <Tooltip title="Удалить комментарий">
                    <IconButton
                        aria-label="Удалить комментарий"
                        size="small"
                        onClick={onDelete}
                        className={styles.deleteButton}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </>
    );
};
