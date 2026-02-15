import { useState } from 'react';
import { Button } from '@mui/material';

import styles from './TasksPage.module.scss';

import { PageHeading } from '@/components/ui/PageHeading/PageHeading';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';

import type { TasksStatusValue } from '@/types/task/TaskStatus';
import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TaskRoleValue } from '@/types/task/TaskRole';

import { taskStatuses } from '@/constants/taskStatuses';
import { taskPriorities } from '@/constants/taskPriorities';
import { taskRoles } from '@/constants/taskRoles';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';

export const TasksPage = () => {
    const [status, setStatus] = useState<TasksStatusValue>('');
    const [priority, setPriority] = useState<TaskPriorityValue>('');
    const [role, setRole] = useState<TaskRoleValue>('');
    const [dateFilter, setDateFilter] = useState<'increase' | 'decrease' | ''>('');

    return (
        <>
            <PageHeading title="Задачи" />

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
            </section>
        </>
    );
};
