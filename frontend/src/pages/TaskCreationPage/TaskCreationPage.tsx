import { useState } from 'react';
import { Button } from '@mui/material';

import styles from './TaskCreationPage.module.scss';

import { BaseTextarea } from '@/components/ui/BaseTextarea/BaseTextarea';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';
import { BaseDatePicker } from '@/components/ui/BaseDatePicker/BaseDatePicker';

import { taskPriorities } from '@/constants/taskPriorities';

import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { Dayjs } from 'dayjs';

export const TaskCreationPage = () => {
    const [priority, setPriority] = useState<TaskPriorityValue>('P3');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);

    const subFormItems = [
        {
            id: 1,
            label: 'Приоритет',
            component: (
                <BaseSelect
                    value={priority}
                    menuItems={taskPriorities}
                    onChange={setPriority}
                    fullWidth
                />
            ),
        },
        {
            id: 2,
            label: 'Дата начала',
            component: (
                <BaseDatePicker value={startDate} onChange={(newValue) => setStartDate(newValue)} />
            ),
        },
        {
            id: 3,
            label: 'Дедлайн',
            component: <BaseDatePicker />,
        },
        {
            id: 4,
            label: 'Инициатор',
            component: <BaseInput placeholder="Введите текст для поиска" size="small" fullWidth />,
        },
        {
            id: 5,
            label: 'Ответственный',
            component: <BaseInput placeholder="Введите текст для поиска" size="small" fullWidth />,
        },
        {
            id: 6,
            label: 'Исполнитель',
            component: <BaseInput placeholder="Введите текст для поиска" size="small" fullWidth />,
        },
        {
            id: 7,
            label: 'Подразделение',
            component: <BaseInput placeholder="Введите название" size="small" fullWidth />,
        },
    ];

    return (
        <section className={styles.pageWrapper}>
            <div className={styles.heroForm}>
                <BaseTextarea
                    placeholder="Введите название задачи"
                    style={{ fontSize: '18px', fontWeight: 500 }}
                />
                <BaseTextarea
                    minRows={6}
                    placeholder="Введите описание задачи"
                    style={{ fontSize: '15px' }}
                />
                <div className={styles.heroFormButtonsSection}>
                    <Button variant="contained" size="small">
                        Создать задачу
                    </Button>
                    <Button variant="outlined" size="small">
                        Отменить
                    </Button>
                </div>
            </div>
            <div className={styles.subFormWrapper}>
                <ul className={styles.subFormList}>
                    {subFormItems.map((item) => (
                        <li key={item.id} className={styles.subFormItem}>
                            <span>{item.label}</span>
                            <div className={styles.subFormComponent}>{item.component}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
