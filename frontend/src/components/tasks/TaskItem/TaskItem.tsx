import { Link } from 'react-router';
import { Avatar, AvatarGroup, Chip } from '@mui/material';

import styles from './TaskItem.module.scss';

import { TASK_STATUS_CONFIG } from '@/constants/taskStatuses';
import { TASK_PRIORITY_CONFIG } from '@/constants/taskPriorities';

import { stringAvatar } from '@/helpers/stringAvatar';
import { formatDate } from '@/helpers/formatDate';

import type { TaskListItem } from '@/types/task/TaskListItem';
import type { TasksStatusValue } from '@/types/task/TaskStatus';
import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';

type TaskItemProps = {
    task: TaskListItem;
};

export const TaskItem = ({ task }: TaskItemProps) => {
    const status = task.status.toLowerCase() as TasksStatusValue;

    const executorsFullNames = task.executors
        .map((e) => `${e.firstName} ${e.secondName}`)
        .join(', ');

    return (
        <Link to={`/tasks/${task.id}`} className={styles.taskItem}>
            <div className={styles.taskTitleBlock}>
                <span className={styles.taskTitle}>{task.name}</span>
                <span className={styles.taskDate}>{formatDate(task.createdAt)}</span>
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

            {task.department && (
                <div className={styles.taskDepartment}>{DEPARTMENT_LABELS[task.department]}</div>
            )}

            {/* <div className={styles.taskExecutor}>
                <Avatar
                    {...stringAvatar(task.executor.firstName + ' ' + task.executor.secondName)}
                    sx={{ width: 32, height: 32, fontSize: 16 }}
                />
                <span>
                    {task.executor.firstName} {task.executor.secondName}
                </span>
            </div> */}
            <div className={styles.taskExecutor} title={executorsFullNames}>
                <AvatarGroup
                    max={3}
                    sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 14 } }}
                >
                    {task.executors.map((executor) => (
                        <Avatar
                            key={executor.firstName + executor.secondName}
                            {...stringAvatar(`${executor.firstName} ${executor.secondName}`)}
                        />
                    ))}
                </AvatarGroup>
                <span>{executorsFullNames}</span>
            </div>
        </Link>
    );
};
