import { useState } from 'react';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import styles from './TaskDetailsPage.module.scss';

import { BaseTextarea } from '@/components/ui/BaseTextarea/BaseTextarea';
import { CommentaryList } from '@/components/comment/CommentaryList/CommentaryList';

import type { Commentary } from '@/types/comment/Commentary';

export const TaskDetailsPage = () => {
    const [commentValue, setCommentValue] = useState('');

    const mockCommentaryList: Commentary[] = [
        {
            id: 1,
            author: 'Sergey Ryndin',
            text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quisquam
                    laboriosam magnam architecto nam quos, nesciunt cum quas alias beatae animi
                    porro sunt, quod soluta facere amet tempora nostrum repudiandae. Lorem ipsum
                    dolor sit amet consectetur adipisicing elit. Ullam quisquam laboriosam
                    magnam architecto nam quos, nesciunt cum quas alias beatae animi porro sunt,
                    quod soluta facere amet tempora nostrum repudiandae.`,
        },
        {
            id: 2,
            author: 'Alexey Chekhov',
            text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quisquam
                    laboriosam magnam architecto nam quos, nesciunt cum quas alias beatae animi
                    porro sunt, quod soluta facere amet tempora nostrum repudiandae. Lorem ipsum
                    dolor sit amet consectetur adipisicing elit. Ullam quisquam laboriosam
                    magnam architecto nam quos, nesciunt cum quas alias beatae animi porro sunt,
                    quod soluta facere amet tempora nostrum repudiandae.`,
        },
    ];

    return (
        <section className={styles.pageWrapper}>
            <div className={styles.heroBlock}>
                <section className={styles.heroSection}>
                    <h1 className={styles.taskTitle}>Название какой-то задачи</h1>
                    <span className={styles.taskDescription}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quisquam
                        laboriosam magnam architecto nam quos, nesciunt cum quas alias beatae animi
                        porro sunt, quod soluta facere amet tempora nostrum repudiandae. Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Ullam quisquam laboriosam
                        magnam architecto nam quos, nesciunt cum quas alias beatae animi porro sunt,
                        quod soluta facere amet tempora nostrum repudiandae.
                    </span>
                </section>

                <section className={styles.commentSection}>
                    <span>Комментарии</span>
                    <CommentaryList commentaryList={mockCommentaryList} />
                    <div className={styles.commentAreaWrapper}>
                        <BaseTextarea
                            minRows={4}
                            placeholder="Комментарий"
                            value={commentValue}
                            onChange={(e) => setCommentValue(e.target.value)}
                            style={{ paddingBottom: '46px' }}
                        />
                        {commentValue && (
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<SendIcon />}
                                sx={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '6px',
                                }}
                            >
                                Отправить
                            </Button>
                        )}
                    </div>
                </section>
            </div>

            <div className={styles.taskInfoBlock}>
                <ul className={styles.taskInfoList}>
                    <li className={styles.taskInfoItem}>
                        <div className={styles.taskInfoItemTitle}>Тип</div>
                        <div className={styles.taskInfoItemValue}>Задача</div>
                    </li>
                    <li className={styles.taskInfoItem}>
                        <div className={styles.taskInfoItemTitle}>Приоритет</div>
                        <div className={styles.taskInfoItemValue}>Высокий</div>
                    </li>
                    <li className={styles.taskInfoItem}>
                        <div className={styles.taskInfoItemTitle}>Статус</div>
                        <div className={styles.taskInfoItemValue}>В работе</div>
                    </li>
                    <li className={styles.taskInfoItem}>
                        <div className={styles.taskInfoItemTitle}>Дата начала</div>
                        <div className={styles.taskInfoItemValue}>–</div>
                    </li>
                    <li className={styles.taskInfoItem}>
                        <div className={styles.taskInfoItemTitle}>Дедлайн</div>
                        <div className={styles.taskInfoItemValue}>–</div>
                    </li>
                    <li className={styles.taskInfoItem}>
                        <div className={styles.taskInfoItemTitle}>Инициатор</div>
                        <div className={styles.taskInfoItemValue}>Не назначен</div>
                    </li>
                    <li className={styles.taskInfoItem}>
                        <div className={styles.taskInfoItemTitle}>Ответственный</div>
                        <div className={styles.taskInfoItemValue}>Не назначен</div>
                    </li>
                    <li className={styles.taskInfoItem}>
                        <div className={styles.taskInfoItemTitle}>Исполнитель</div>
                        <div className={styles.taskInfoItemValue}>Не назначен</div>
                    </li>
                    <li className={styles.taskInfoItem}>
                        <div className={styles.taskInfoItemTitle}>Подразделение</div>
                        <div className={styles.taskInfoItemValue}>ОСО</div>
                    </li>
                </ul>
            </div>
        </section>
    );
};
