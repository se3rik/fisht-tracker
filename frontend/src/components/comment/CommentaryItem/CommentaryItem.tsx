import { Avatar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
            <Avatar
                {...stringAvatar(author)}
                sx={{ width: 32, height: 32, fontSize: 16, mr: '10px' }}
            />
            <div className={styles.commentInfo}>
                <div className={styles.commentTitle}>
                    <span className={styles.commentAuthor}>{author}</span>
                    <span className={styles.commentDate}>{formatDateTime(comment.createdAt)}</span>
                </div>
                {comment.text && <span className={styles.commentText}>{comment.text}</span>}
                <CommentAttachments attachments={comment.attachments} />
            </div>
            {canDelete && (
                <IconButton
                    size="small"
                    onClick={onDelete}
                    sx={{
                        ml: 'auto',
                        color: '#dc2626',
                        '&:hover': {
                            backgroundColor: 'rgba(220, 38, 38, 0.15)',
                        },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}
        </>
    );
};
