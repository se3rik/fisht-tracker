import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Button } from '@mui/material';

import styles from './TaskCreationPage.module.scss';

import { tasksApi } from '@/api';

import { BaseTextarea } from '@/components/ui/BaseTextarea/BaseTextarea';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';
import { BaseDatePicker } from '@/components/ui/BaseDatePicker/BaseDatePicker';
import { UserAutocomplete } from '@/components/userAutocomplete/UsersAutocomplete';

import { taskPriorities } from '@/constants/taskPriorities';
import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';

import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { Dayjs } from 'dayjs';

export const TaskCreationPage = () => {
    const navigate = useNavigate();

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [priority, setPriority] = useState<TaskPriorityValue>('P3');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [deadline, setDeadline] = useState<Dayjs | null>(null);
    const [executorId, setExecutorId] = useState('');
    const [answerableId, setAnswerableId] = useState('');
    const [initiatorId, setInitiatorId] = useState('');
    const [department, setDepartment] = useState('');

    const departmentItems = Object.entries(DEPARTMENT_LABELS).map(([value, title], id) => ({
        id,
        value,
        title,
    }));

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
            component: (
                <BaseDatePicker value={deadline} onChange={(newValue) => setDeadline(newValue)} />
            ),
        },
        {
            id: 4,
            label: 'Инициатор',
            component: <UserAutocomplete onChange={setInitiatorId} />,
        },
        {
            id: 5,
            label: 'Ответственный',
            component: <UserAutocomplete onChange={setAnswerableId} />,
        },
        {
            id: 6,
            label: 'Исполнитель',
            component: <UserAutocomplete onChange={setExecutorId} />,
        },
        {
            id: 7,
            label: 'Подразделение',
            component: (
                <BaseSelect
                    value={department}
                    displayEmpty
                    menuItems={[
                        { id: 0, value: '', title: 'Выберите подразделение' },
                        ...departmentItems,
                    ]}
                    sx={{
                        '& .MuiSelect-select': {
                            color: department ? 'white' : '#ffffff80',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                        },
                    }}
                    onChange={setDepartment}
                    fullWidth
                />
            ),
        },
    ];

    const onTaskCreate = async () => {
        try {
            await tasksApi.createTask({
                name: taskName,
                description: taskDescription,
                priority,
                executorId,
                answerableId,
                initiatorId,
                department,
                startDate: startDate ? startDate.toISOString() : undefined,
                deadline: deadline ? deadline.toISOString() : undefined,
            });

            navigate('/tasks');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className={styles.pageWrapper}>
            <div className={styles.heroForm}>
                <BaseTextarea
                    placeholder="Введите название задачи"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    style={{ fontSize: '18px', fontWeight: 500 }}
                />
                <BaseTextarea
                    minRows={6}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Введите описание задачи"
                    style={{ fontSize: '15px' }}
                />
                <div className={styles.heroFormButtonsSection}>
                    <Button variant="contained" size="small" onClick={onTaskCreate}>
                        Создать задачу
                    </Button>
                    <Button variant="outlined" size="small" onClick={() => navigate('/tasks')}>
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
