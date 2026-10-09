import { Link } from 'react-router';
import { Avatar, AvatarGroup, Chip } from '@mui/material';

import styles from './TaskItem.module.scss';

import { TASK_STATUS_CONFIG } from '@/constants/taskStatuses';
import { TASK_PRIORITY_CONFIG } from '@/constants/taskPriorities';

import { stringAvatar } from '@/helpers/stringAvatar';
import { formatDate } from '@/helpers/formatDate';
import { getDeadlineInfo } from '@/helpers/getDeadlineInfo';

import type { TaskListItem } from '@/types/task/TaskListItem';
import type { TasksStatusValue } from '@/types/task/TaskStatus';
import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';

type TaskItemProps = {
    task: TaskListItem;
};

const urgencyColor: Record<string, string> = {
    overdue: '#f87171',
    urgent: '#fbbf24',
    normal: 'inherit',
    none: '#ffffff80',
};

export const TaskItem = ({ task }: TaskItemProps) => {
    const status = task.status.toLowerCase() as TasksStatusValue;

    const executorsFullNames = task.executors
        .map((e) => `${e.firstName} ${e.secondName}`)
        .join(', ');

    const deadlineInfo = getDeadlineInfo(task.deadline);

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

            <div className={styles.taskDeadline}>
                <span className={styles.taskDeadlineDate}>
                    {task.deadline ? formatDate(task.deadline) : '—'}
                </span>
                <span
                    className={styles.taskDeadlineLabel}
                    style={{ color: urgencyColor[deadlineInfo.urgency] }}
                >
                    {deadlineInfo.label}
                </span>
            </div>

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
