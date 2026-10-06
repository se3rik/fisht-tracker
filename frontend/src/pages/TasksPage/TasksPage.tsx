import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Pagination } from '@mui/material';

import styles from './TasksPage.module.scss';

import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';
import { TaskItem } from '@/components/tasks/TaskItem/TaskItem';
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
    const { profileData } = useAppSelector((state) => state.profile);

    const LIMIT = 8;
    const [page, setPage] = useState(1);
    const [name, setName] = useState('');
    const [status, setStatus] = useState<TasksStatusValue>('');
    const [priority, setPriority] = useState<TaskPriorityValue>('');
    const [department, setDepartment] = useState<TaskDepartmentValues | ''>('');
    const [role, setRole] = useState<TaskRoleValue>('');
    const [dateFilter, setDateFilter] = useState<SortDirection>('');
    const [deadlineFilter, setDeadlineFilter] = useState<SortDirection>('asc');

    const isFiltersEmpty =
        !name && !status && !priority && !role && !dateFilter && !department && !deadlineFilter;

    const { tasks, total } = useTasksList({
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
    };

    useEffect(() => {
        if (profileData?.department) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDepartment(profileData.department);
        }
    }, [profileData?.department]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
    }, [name, status, priority, department, role, dateFilter, deadlineFilter]);

    return (
        <section className={styles.pageWrapper}>
            <section className={styles.filterSection}>
                <div className={styles.filterToolsWrapper}>
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

                <Button
                    variant="contained"
                    onClick={() => navigate('/tasks/new-task')}
                    size="small"
                    className={styles.createTaskButton}
                >
                    Создать задачу
                </Button>
            </section>

            <section className={styles.mainContent}>
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
                {tasks.length === 0 && (
                    <>
                        <span
                            style={{
                                color: '#ffffff',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                textAlign: 'center',
                                marginTop: '20px',
                            }}
                        >
                            {`По заданым фильтрам задач не нашлось`}
                        </span>
                        <span
                            style={{
                                color: '#ffffff',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                textAlign: 'center',
                            }}
                        >
                            {`или`}
                        </span>
                        <span
                            style={{
                                color: '#ffffff',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                textAlign: 'center',
                            }}
                        >
                            {`Список задач пуст`}
                        </span>
                    </>
                )}
                {tasks.map((task) => (
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
                    margin: '0 auto',
                    '& .MuiPaginationItem-root': {
                        color: 'white',
                        borderColor: '#bdbdbd',
                    },
                }}
            />
        </section>
    );
};
