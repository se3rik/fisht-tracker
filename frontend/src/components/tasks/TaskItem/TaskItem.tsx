import { Link } from 'react-router';
import { Avatar, Chip } from '@mui/material';

import styles from './TaskItem.module.scss';

import { TASK_STATUS_CONFIG } from '@/constants/taskStatuses';
import { TASK_PRIORITY_CONFIG } from '@/constants/taskPriorities';

import { stringAvatar } from '@/helpers/stringAvatar';

import type { TaskListItem } from '@/types/task/TaskListItem';
import type { TasksStatusValue } from '@/types/task/TaskStatus';

type TaskItemProps = {
    task: TaskListItem;
};

export const TaskItem = ({ task }: TaskItemProps) => {
    const status = task.status.toLowerCase() as TasksStatusValue;

    return (
        <Link to={`/tasks/${task.id}`} className={styles.taskItem}>
            <div className={styles.taskTitleBlock}>
                <span className={styles.taskTitle}>{task.name}</span>
                <span className={styles.taskDate}>{task.createdAt}</span>
            </div>

            {status && (
                <div>
                    <Chip
                        label={TASK_STATUS_CONFIG[status].label}
                        sx={{
                            backgroundColor: TASK_STATUS_CONFIG[status].bgcolor,
                            color: TASK_STATUS_CONFIG[status].color,
                        }}
                    />
                </div>
            )}

            {task.priority && (
                <div>
                    <Chip
                        label={TASK_PRIORITY_CONFIG[task.priority].label}
                        sx={{
                            backgroundColor: TASK_PRIORITY_CONFIG[task.priority].bgcolor,
                            color: TASK_PRIORITY_CONFIG[task.priority].color,
                            border:
                                TASK_PRIORITY_CONFIG[task.priority].bgcolor === 'transparent'
                                    ? `1px solid ${TASK_PRIORITY_CONFIG[task.priority].color}`
                                    : 'none',
                        }}
                    />
                </div>
            )}

            <div className={styles.taskExecutor}>
                <Avatar
                    {...stringAvatar(task.executor.firstName + ' ' + task.executor.secondName)}
                    sx={{ width: 32, height: 32, fontSize: 16 }}
                />
                <span>
                    {task.executor.firstName} {task.executor.secondName}
                </span>
            </div>
        </Link>
    );
};
