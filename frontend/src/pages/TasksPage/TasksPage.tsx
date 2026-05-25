import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';

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

export const TasksPage = () => {
    const navigate = useNavigate();
    const { profileData } = useAppSelector((state) => state.profile);

    const [name, setName] = useState('');
    const [status, setStatus] = useState<TasksStatusValue>('');
    const [priority, setPriority] = useState<TaskPriorityValue>('');
    const [department, setDepartment] = useState<TaskDepartmentValues | ''>('');
    const [role, setRole] = useState<TaskRoleValue>('');
    const [dateFilter, setDateFilter] = useState<'asc' | 'desc' | ''>('');

    const isFiltersEmpty = !name && !status && !priority && !role && !dateFilter && !department;

    const { tasks } = useTasksList({
        name,
        role: role || undefined,
        status: status || undefined,
        department: department || undefined,
        priority: priority || undefined,
        sortByDate: dateFilter || undefined,
    });

    const resetFilters = () => {
        setName('');
        setStatus('');
        setPriority('');
        setDepartment('');
        setRole('');
        setDateFilter('');
    };

    useEffect(() => {
        if (profileData?.department) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDepartment(profileData.department);
        }
    }, [profileData?.department]);

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
                    <div>Исполнитель</div>
                </div>
                {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </section>
        </section>
    );
};
