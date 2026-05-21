import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';

import styles from './TasksPage.module.scss';

import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';
import { TaskItem } from '@/components/tasks/TaskItem/TaskItem';

import type { TasksStatusValue } from '@/types/task/TaskStatus';
import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TaskRoleValue } from '@/types/task/TaskRole';

import { useTasksList } from '@/hooks/useTasksList';

import { taskStatuses } from '@/constants/taskStatuses';
import { taskPriorities } from '@/constants/taskPriorities';
import { taskRoles } from '@/constants/taskRoles';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';

export const TasksPage = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [status, setStatus] = useState<TasksStatusValue>('');
    const [priority, setPriority] = useState<TaskPriorityValue>('');
    const [role, setRole] = useState<TaskRoleValue>('');
    const [dateFilter, setDateFilter] = useState<'asc' | 'desc' | ''>('');

    const { tasks } = useTasksList({
        name,
        role: role || undefined,
        status: status || undefined,
        priority: priority || undefined,
        sortByDate: dateFilter || undefined,
    });

    return (
        <section className={styles.pageWrapper}>
            <section className={styles.filterSection}>
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
                {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </section>
        </section>
    );
};
