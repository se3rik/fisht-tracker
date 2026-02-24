import { TextareaAutosize, type TextareaAutosizeProps } from '@mui/material';

import styles from './BaseTextarea.module.scss';

type BaseTextareaProps = TextareaAutosizeProps;

export const BaseTextarea = ({ ...props }: BaseTextareaProps) => {
    return <TextareaAutosize className={styles.textarea} {...props} />;
};
