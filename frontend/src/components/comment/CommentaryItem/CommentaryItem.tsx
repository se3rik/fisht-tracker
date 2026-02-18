import { Avatar } from '@mui/material';

import styles from './CommentaryItem.module.scss';

import { stringAvatar } from '@/helpers/stringAvatar';

type CommentaryItemProps = {
    author: string;
    text: string;
};

export const CommentaryItem = ({ author, text }: CommentaryItemProps) => {
    return (
        <>
            <Avatar
                {...stringAvatar(author)}
                sx={{ width: 32, height: 32, fontSize: 16, mr: '10px' }}
            />
            <div className={styles.commentInfo}>
                <span className={styles.commentAuthor}>{author}</span>
                <span className={styles.commentText}>{text}</span>
            </div>
        </>
    );
};
