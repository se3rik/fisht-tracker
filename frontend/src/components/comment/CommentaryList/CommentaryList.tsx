import styles from './CommentaryList.module.scss';

import { CommentaryItem } from '@/components/comment/CommentaryItem/CommentaryItem';

import type { Commentary } from '@/types/comment/Commentary';

type CommentaryListProps = {
    commentaryList: Commentary[];
};

export const CommentaryList = ({ commentaryList }: CommentaryListProps) => {
    return (
        <ul className={styles.commentList}>
            {commentaryList.map((comment) => (
                <li key={comment.id} className={styles.commentItem}>
                    <CommentaryItem
                        author={`${comment.author.firstName} ${comment.author.secondName}`}
                        text={comment.text}
                    />
                </li>
            ))}
        </ul>
    );
};
