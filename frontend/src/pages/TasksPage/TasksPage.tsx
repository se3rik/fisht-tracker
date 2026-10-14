import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Alert, Button, Chip, CircularProgress, Pagination } from '@mui/material';

import styles from './TasksPage.module.scss';

import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';
import { TaskItem } from '@/components/tasks/TaskItem/TaskItem';
import { PageIntro } from '@/components/pageIntro/PageIntro';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';

import type { TasksStatusValue } from '@/types/task/TaskStatus';
import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TaskRoleValue } from '@/types/task/TaskRole';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

import { useTasksList } from '@/hooks/useTasksList';
import { useAppSelector } from '@/hooks/useAppSelector';

import { taskStatuses } from '@/constants/taskStatuses';
import { taskPriorities } from '@/constants/taskPriorities';
import { taskRoles } from '@/constants/taskRoles';
import { taskDepartments } from '@/constants/taskDepartments';

type SortDirection = 'asc' | 'desc' | '';

export const TasksPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const overviewParam = searchParams.get('overview');
    const overview =
        overviewParam === 'actionRequired' || overviewParam === 'overdue' || overviewParam === 'upcoming'
            ? overviewParam
            : undefined;
    const overviewLabel = overview === 'actionRequired'
        ? 'Требуют внимания'
        : overview === 'overdue'
          ? 'Просрочены'
          : overview === 'upcoming'
            ? 'Ближайшие 7 дней'
            : null;
    const { profileData } = useAppSelector((state) => state.profile);
    const departmentInitialized = useRef(false);

    const LIMIT = 8;
    const [page, setPage] = useState(1);
    const [name, setName] = useState('');
    const [status, setStatus] = useState<TasksStatusValue>('');
    const [priority, setPriority] = useState<TaskPriorityValue>('');
    const [department, setDepartment] = useState<TaskDepartmentValues | ''>('');
    const [role, setRole] = useState<TaskRoleValue>('');
    const [dateFilter, setDateFilter] = useState<SortDirection>('');
    const [deadlineFilter, setDeadlineFilter] = useState<SortDirection>(overview ? '' : 'asc');

    const isFiltersEmpty =
        !overview && !name && !status && !priority && !role && !dateFilter && !department && !deadlineFilter;

    const { tasks, total, isLoading, error } = useTasksList({
        overview,
        name,
        role: role || undefined,
        status: status || undefined,
        department: department || undefined,
        priority: priority || undefined,
        sortByDate: dateFilter || undefined,
        sortByDeadline: deadlineFilter || undefined,
        limit: LIMIT,
        skip: (page - 1) * LIMIT,
    });

    const resetFilters = () => {
        setName('');
        setStatus('');
        setPriority('');
        setDepartment('');
        setRole('');
        setDateFilter('');
        setDeadlineFilter('');
        setPage(1);
        setSearchParams({});
    };

    useEffect(() => {
        if (profileData && !departmentInitialized.current) {
            departmentInitialized.current = true;
            if (profileData.department && !overview) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setDepartment(profileData.department);
            }
        }
    }, [profileData, overview]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
    }, [overview, name, status, priority, department, role, dateFilter, deadlineFilter]);

    return (
        <section className={styles.pageWrapper}>
            <PageIntro
                eyebrow="Рабочее пространство"
                title="Задачи"
                description="Следите за поручениями, сроками и ответственными в одном месте."
                action={
                    <Button variant="contained" onClick={() => navigate('/tasks/new-task')}>
                        Создать задачу
                    </Button>
                }
            />
            <section className={styles.filterSection}>
                <div className={styles.filterToolsWrapper}>
                    {overviewLabel && <Chip label={`Подборка: ${overviewLabel}`} onDelete={() => setSearchParams({})} />}
                    <div className={styles.filterTools}>
                        <BaseInput
                            id="taskName"
                            type="text"
                            size="small"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Поиск по названию задачи"
                        />

                        <BaseSelect
                            label="Роль"
                            value={role}
                            menuItems={taskRoles}
                            onChange={setRole}
                        />

                        <BaseSelect
                            label="Статус"
                            value={status}
                            menuItems={taskStatuses}
                            onChange={setStatus}
                        />

                        <BaseSelect
                            label="Отдел"
                            value={department}
                            menuItems={taskDepartments}
                            onChange={setDepartment}
                        />

                        <BaseSelect
                            label="Приоритет"
                            value={priority}
                            menuItems={taskPriorities}
                            onChange={setPriority}
                        />

                        <BaseSelect
                            label="Дата"
                            value={dateFilter}
                            menuItems={[
                                { id: 1, value: 'asc', title: 'По возрастанию' },
                                { id: 2, value: 'desc', title: 'По убыванию' },
                            ]}
                            onChange={setDateFilter}
                        />

                        <BaseSelect
                            label="Дедлайн"
                            value={deadlineFilter}
                            menuItems={[
                                { id: 1, value: 'asc', title: 'Сначала ближайшие' },
                                { id: 2, value: 'desc', title: 'Сначала дальние' },
                            ]}
                            onChange={setDeadlineFilter}
                        />
                    </div>
                    <div className={styles.filterActions}>
                        <Button
                            variant="contained"
                            size="small"
                            disabled={isFiltersEmpty}
                            onClick={resetFilters}
                        >
                            Сбросить фильтры
                        </Button>
                    </div>
                </div>
            </section>

            <section className={styles.mainContent}>
                {error && <Alert severity="error">{error}</Alert>}
                {isLoading && <div className={styles.emptyState}><CircularProgress aria-label="Загрузка задач" /></div>}
                <div className={styles.tasksHeader}>
                    <div>Название</div>
                    <div>Статус</div>
                    <div>Приоритет</div>
                    <div>Отдел</div>
                    <div className={styles.sortableHeader} role="button" tabIndex={0}>
                        Дедлайн
                    </div>
                    <div>Исполнитель</div>
                </div>
                {!isLoading && !error && tasks.length === 0 && (
                    <div className={styles.emptyState}>
                        {isFiltersEmpty
                            ? 'Задач пока нет.'
                            : 'По выбранным фильтрам задач не найдено.'}
                    </div>
                )}
                {!isLoading && !error && tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </section>

            <Pagination
                count={Math.ceil(total / LIMIT)}
                page={page}
                onChange={(_, value) => setPage(value)}
                variant="outlined"
                color="primary"
                sx={{
                    margin: 'auto auto 0',
                    flexShrink: 0,
                    '& .MuiPaginationItem-root': {
                        color: 'white',
                        borderColor: '#bdbdbd',
                    },
                }}
            />
        </section>
    );
};
