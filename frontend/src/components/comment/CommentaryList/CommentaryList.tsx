import styles from './CommentaryList.module.scss';

import { CommentaryItem } from '@/components/comment/CommentaryItem/CommentaryItem';

import type { Commentary } from '@/types/comment/Commentary';

type CommentaryListProps = {
    commentaryList: Commentary[];
    currentUserId: string;
    isAdmin: boolean;
    onDeleteComment: (commentId: string) => void;
};

export const CommentaryList = ({
    commentaryList,
    currentUserId,
    isAdmin,
    onDeleteComment,
}: CommentaryListProps) => {
    return (
        <ul className={styles.commentList}>
            {commentaryList.map((comment) => (
                <li key={comment.id} className={styles.commentItem}>
                    <CommentaryItem
                        comment={comment}
                        canDelete={isAdmin || comment.authorId === currentUserId}
                        onDelete={() => onDeleteComment(comment.id)}
                    />
                </li>
            ))}
        </ul>
    );
};
