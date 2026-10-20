import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Alert, Box, Button, Chip, CircularProgress, Paper, Typography } from '@mui/material';

import styles from './HomePage.module.scss';

import { tasksApi } from '@/api/tasks.api';
import { PageIntro } from '@/components/pageIntro/PageIntro';
import { TASK_STATUS_CONFIG } from '@/constants/taskStatuses';
import { formatDate } from '@/helpers/formatDate';
import { getDeadlineInfo } from '@/helpers/getDeadlineInfo';
import { useAppSelector } from '@/hooks/useAppSelector';
import { TASKS_CHANGED_EVENT } from '@/hooks/useLiveEvents';

import type { TaskListItem } from '@/types/task/TaskListItem';
import type { TasksStatusValue } from '@/types/task/TaskStatus';

type Overview = Awaited<ReturnType<typeof tasksApi.getOverview>>;

type TaskSectionProps = {
    overview: 'actionRequired' | 'overdue' | 'upcoming';
    title: string;
    description: string;
    tasks: TaskListItem[];
    emptyText: string;
};

const TaskSection = ({ overview, title, description, tasks, emptyText }: TaskSectionProps) => (
    <Paper component="section" variant="outlined" className={styles.section}>
        <Box className={styles.sectionHeading}>
            <Box>
                <Typography component="h2" variant="h6">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </Box>
            <Button component={Link} to={`/tasks?overview=${overview}`} size="small">
                К списку задач
            </Button>
        </Box>
        {tasks.length === 0 ? (
            <Typography className={styles.emptyState} color="text.secondary">
                {emptyText}
            </Typography>
        ) : (
            <Box className={styles.taskList}>
                {tasks.map((task) => {
                    const status = task.status.toLowerCase() as Exclude<TasksStatusValue, ''>;
                    const deadline = getDeadlineInfo(task.deadline);
                    return (
                        <Box
                            key={task.id}
                            component={Link}
                            to={`/tasks/${task.id}`}
                            className={styles.taskLink}
                        >
                            <Box className={styles.taskInfo}>
                                <Typography className={styles.taskName}>{task.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {task.deadline
                                        ? `Срок: ${formatDate(task.deadline)}`
                                        : 'Без срока'}
                                    {task.deadline ? ` · ${deadline.label}` : ''}
                                </Typography>
                            </Box>
                            <Chip
                                size="small"
                                label={TASK_STATUS_CONFIG[status]?.label ?? task.status}
                                sx={
                                    TASK_STATUS_CONFIG[status]
                                        ? {
                                              backgroundColor: TASK_STATUS_CONFIG[status].bgcolor,
                                              color: TASK_STATUS_CONFIG[status].color,
                                          }
                                        : undefined
                                }
                            />
                        </Box>
                    );
                })}
            </Box>
        )}
    </Paper>
);

export const HomePage = () => {
    const { profileData } = useAppSelector((state) => state.profile);
    const fullName = [profileData?.secondName, profileData?.firstName, profileData?.patronymic]
        .filter(Boolean)
        .join(' ');
    const [overview, setOverview] = useState<Overview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        let latestRequest = 0;
        const reload = () => {
            const requestId = ++latestRequest;
            void tasksApi
                .getOverview()
                .then((data) => {
                    if (active && requestId === latestRequest) {
                        setOverview(data);
                        setError(null);
                    }
                })
                .catch((err: unknown) => {
                    if (active && requestId === latestRequest)
                        setError(
                            err instanceof Error ? err.message : 'Не удалось загрузить задачи',
                        );
                })
                .finally(() => {
                    if (active && requestId === latestRequest) setLoading(false);
                });
        };
        reload();
        window.addEventListener(TASKS_CHANGED_EVENT, reload);
        return () => {
            active = false;
            window.removeEventListener(TASKS_CHANGED_EVENT, reload);
        };
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <PageIntro
                eyebrow="Рабочее пространство"
                title={fullName ? `Здравствуйте, ${fullName}` : 'Главная'}
                description="Ваши ближайшие сроки и задачи, требующие внимания."
                action={
                    <Button component={Link} to="/tasks/new-task" variant="contained">
                        Создать задачу
                    </Button>
                }
            />
            {loading && (
                <Box className={styles.loading}>
                    <CircularProgress aria-label="Загрузка задач" />
                </Box>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {overview && !error && (
                <div className={styles.sections}>
                    <TaskSection
                        overview="actionRequired"
                        title="Требуют внимания"
                        description="Новые поручения, доработка и задачи на рассмотрении"
                        tasks={overview.actionRequired}
                        emptyText="Сейчас нет задач, требующих вашего действия."
                    />
                    <TaskSection
                        overview="overdue"
                        title="Просрочены"
                        description="Связанные с вами задачи, срок которых прошёл"
                        tasks={overview.overdue}
                        emptyText="Просроченных задач нет."
                    />
                    <TaskSection
                        overview="upcoming"
                        title="Ближайшие 7 дней"
                        description="Связанные с вами задачи с наступающим сроком"
                        tasks={overview.upcoming}
                        emptyText="Задач с ближайшим сроком нет."
                    />
                </div>
            )}
        </div>
    );
};
