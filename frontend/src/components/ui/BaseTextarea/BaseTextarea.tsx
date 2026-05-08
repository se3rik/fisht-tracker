import { TextareaAutosize, type TextareaAutosizeProps } from '@mui/material';

import styles from './BaseTextarea.module.scss';

type BaseTextareaProps = TextareaAutosizeProps & {
    error?: boolean;
};

export const BaseTextarea = ({ error, ...props }: BaseTextareaProps) => {
    return (
        <TextareaAutosize
            className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
            {...props}
        />
    );
};
