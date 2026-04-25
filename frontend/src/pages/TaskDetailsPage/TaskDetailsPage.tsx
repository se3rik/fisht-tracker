import { useState } from 'react';
import { useParams } from 'react-router';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import styles from './TaskDetailsPage.module.scss';

import { tasksApi } from '@/api';

import { BaseTextarea } from '@/components/ui/BaseTextarea/BaseTextarea';
import { CommentaryList } from '@/components/comment/CommentaryList/CommentaryList';

import { useTasksItem } from '@/hooks/useTaskItem';
import { useAppSelector } from '@/hooks/useAppSelector';

import { TASK_PRIORITY_CONFIG } from '@/constants/taskPriorities';
import { TASK_STATUS_CONFIG } from '@/constants/taskStatuses';
import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';

import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TasksStatusValue } from '@/types/task/TaskStatus';

import { formatDate } from '@/helpers/formatDate';

export const TaskDetailsPage = () => {
    const urlParams = useParams();
    const { taskData, setTaskData } = useTasksItem(urlParams.id ?? '');
    const { profileData } = useAppSelector((state) => state.profile);
    const [commentValue, setCommentValue] = useState('');

    const handleSendComment = async () => {
        if (!commentValue.trim()) return;

        try {
            const newComment = await tasksApi.createComment(urlParams.id ?? '', commentValue);
            setCommentValue('');
            setTaskData((prev) =>
                prev ? { ...prev, comments: [...prev.comments, newComment] } : prev,
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await tasksApi.deleteComment(urlParams.id ?? '', commentId);
            setTaskData((prev) =>
                prev
                    ? { ...prev, comments: prev.comments.filter((c) => c.id !== commentId) }
                    : prev,
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className={styles.pageWrapper}>
            {taskData && (
                <>
                    <div className={styles.heroBlock}>
                        <section className={styles.heroSection}>
                            <h1 className={styles.taskTitle}>{taskData.name}</h1>
                            <span className={styles.taskDescription}>{taskData.description}</span>
                        </section>

                        <section className={styles.commentSection}>
                            <span>Комментарии</span>
                            <CommentaryList
                                commentaryList={taskData.comments}
                                currentUserId={profileData?.id ?? ''}
                                isAdmin={profileData?.roles === 'ADMIN'}
                                onDeleteComment={handleDeleteComment}
                            />
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
                                        onClick={handleSendComment}
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
                                <div className={styles.taskInfoItemValue}>
                                    {
                                        TASK_PRIORITY_CONFIG[
                                            taskData.priority as Exclude<TaskPriorityValue, ''>
                                        ].label
                                    }
                                </div>
                            </li>
                            <li className={styles.taskInfoItem}>
                                <div className={styles.taskInfoItemTitle}>Статус</div>
                                <div className={styles.taskInfoItemValue}>
                                    {
                                        TASK_STATUS_CONFIG[
                                            taskData.status.toLowerCase() as Exclude<
                                                TasksStatusValue,
                                                ''
                                            >
                                        ].label
                                    }
                                </div>
                            </li>
                            <li className={styles.taskInfoItem}>
                                <div className={styles.taskInfoItemTitle}>Дата начала</div>
                                <div className={styles.taskInfoItemValue}>
                                    {taskData.startDate
                                        ? formatDate(taskData.startDate)
                                        : 'Не назначен'}
                                </div>
                            </li>
                            <li className={styles.taskInfoItem}>
                                <div className={styles.taskInfoItemTitle}>Дедлайн</div>
                                <div className={styles.taskInfoItemValue}>
                                    {taskData.deadline
                                        ? formatDate(taskData.deadline)
                                        : 'Не назначен'}
                                </div>
                            </li>
                            <li className={styles.taskInfoItem}>
                                <div className={styles.taskInfoItemTitle}>Инициатор</div>
                                <div className={styles.taskInfoItemValue}>
                                    {taskData.initiator
                                        ? `${taskData.initiator.firstName} ${taskData.initiator.secondName}`
                                        : 'Не назначен'}
                                </div>
                            </li>
                            <li className={styles.taskInfoItem}>
                                <div className={styles.taskInfoItemTitle}>Ответственный</div>
                                <div className={styles.taskInfoItemValue}>
                                    {taskData.answerable
                                        ? `${taskData.answerable.firstName} ${taskData.answerable.secondName}`
                                        : 'Не назначен'}
                                </div>
                            </li>
                            <li className={styles.taskInfoItem}>
                                <div className={styles.taskInfoItemTitle}>Исполнитель</div>
                                <div className={styles.taskInfoItemValue}>
                                    {taskData.executor
                                        ? `${taskData.executor.firstName} ${taskData.executor.secondName}`
                                        : 'Не назначен'}
                                </div>
                            </li>
                            <li className={styles.taskInfoItem}>
                                <div className={styles.taskInfoItemTitle}>Подразделение</div>
                                <div className={styles.taskInfoItemValue}>
                                    {DEPARTMENT_LABELS[taskData.department]}
                                </div>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </section>
    );
};
