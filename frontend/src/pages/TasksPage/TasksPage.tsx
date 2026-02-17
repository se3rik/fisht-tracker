import { useState } from 'react';
import { Button } from '@mui/material';

import styles from './TasksPage.module.scss';

import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';
import { TaskItem } from '@/components/tasks/TaskItem/TaskItem';

import type { TasksStatusValue } from '@/types/task/TaskStatus';
import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TaskRoleValue } from '@/types/task/TaskRole';
import type { TaskListItem } from '@/types/task/TaskListItem';

import { taskStatuses } from '@/constants/taskStatuses';
import { taskPriorities } from '@/constants/taskPriorities';
import { taskRoles } from '@/constants/taskRoles';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';

export const TasksPage = () => {
    const [status, setStatus] = useState<TasksStatusValue>('');
    const [priority, setPriority] = useState<TaskPriorityValue>('');
    const [role, setRole] = useState<TaskRoleValue>('');
    const [dateFilter, setDateFilter] = useState<'increase' | 'decrease' | ''>('');

    const mockTasksList: TaskListItem[] = [
        {
            id: 1,
            title: 'Основной контент на главной странице',
            createdAt: '15.02.2026',
            status: 'draft',
            priority: 'P1',
            executor: 'Sergey Ryndin',
        },
        {
            id: 2,
            title: 'Основной контент на главной странице',
            createdAt: '15.02.2026',
            status: 'revision',
            priority: 'P2',
            executor: 'Daniil Lunev',
        },
        {
            id: 3,
            title: 'Основной контент на главной странице',
            createdAt: '15.02.2026',
            status: 'in-progress',
            priority: 'P3',
            executor: 'Alexey Chekhov',
        },
        {
            id: 4,
            title: 'Основной контент на главной странице',
            createdAt: '15.02.2026',
            status: 'suspended',
            priority: 'P4',
            executor: 'Nikita Karaput',
        },
        {
            id: 5,
            title: 'Основной контент на главной странице',
            createdAt: '15.02.2026',
            status: 'completed',
            priority: 'P4',
            executor: 'Nikita Isaev',
        },
        {
            id: 6,
            title: 'Основной контент на главной странице',
            createdAt: '15.02.2026',
            status: 'rework',
            priority: 'P1',
            executor: 'Sergey Ryndin',
        },
        {
            id: 7,
            title: 'Основной контент на главной странице',
            createdAt: '15.02.2026',
            status: 'finished',
            priority: 'P1',
            executor: 'Sergey Ryndin',
        },
        {
            id: 8,
            title: 'Основной контент на главной странице',
            createdAt: '15.02.2026',
            status: 'canceled',
            priority: 'P1',
            executor: 'Sergey Ryndin',
        },
        {
            id: 9,
            title: 'Основной контент на главной странице',
            createdAt: '15.02.2026',
            status: 'archive',
            priority: 'P1',
            executor: 'Sergey Ryndin',
        },
    ];

    return (
        <section className={styles.pageWrapper}>
            <section className={styles.filterSection}>
                <div className={styles.filterTools}>
                    <BaseInput
                        id="taskName"
                        type="text"
                        size="small"
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
                            { id: 1, value: 'increase', title: 'По возрастанию' },
                            { id: 2, value: 'decrease', title: 'По убыванию' },
                        ]}
                        onChange={setDateFilter}
                    />
                </div>

                <Button variant="contained" size="small" className={styles.createTaskButton}>
                    Создать задачу
                </Button>
            </section>

            <section className={styles.mainContent}>
                {mockTasksList.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </section>
        </section>
    );
};
