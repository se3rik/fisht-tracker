import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { Button } from '@mui/material';

import styles from './TaskCreationPage.module.scss';

import { tasksApi } from '@/api';

import { BaseTextarea } from '@/components/ui/BaseTextarea/BaseTextarea';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';
import { BaseDatePicker } from '@/components/ui/BaseDatePicker/BaseDatePicker';
import { UserAutocomplete } from '@/components/userAutocomplete/UsersAutocomplete';

import { taskPriorities } from '@/constants/taskPriorities';
import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';

import { createTaskValidationSchema } from '@/validation/taskValidation';

import type { TaskPriorityValue } from '@/types/task/TaskPriority';

type TaskCreationForm = {
    name: string;
    description: string;
    priority: string;
    executorId: string;
    answerableId: string;
    initiatorId: string;
    department: string;
    startDate: string | null;
    deadline: string | null;
};

export const TaskCreationPage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<TaskCreationForm>({
        defaultValues: {
            name: '',
            description: '',
            priority: 'P3',
            executorId: '',
            answerableId: '',
            initiatorId: '',
            department: '',
            startDate: null,
            deadline: null,
        },
        resolver: yupResolver(createTaskValidationSchema),
    });

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
                <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <BaseSelect
                                value={field.value}
                                menuItems={taskPriorities}
                                onChange={field.onChange}
                                error={!!errors.priority}
                                fullWidth
                            />
                            {errors.priority && (
                                <span className={styles.errorText}>{errors.priority.message}</span>
                            )}
                        </div>
                    )}
                />
            ),
        },
        {
            id: 2,
            label: 'Дата начала',
            component: (
                <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                        <BaseDatePicker
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(newValue) =>
                                field.onChange(newValue ? newValue.toISOString() : null)
                            }
                        />
                    )}
                />
            ),
        },
        {
            id: 3,
            label: 'Дедлайн',
            component: (
                <Controller
                    name="deadline"
                    control={control}
                    render={({ field }) => (
                        <BaseDatePicker
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(newValue) =>
                                field.onChange(newValue ? newValue.toISOString() : null)
                            }
                        />
                    )}
                />
            ),
        },
        {
            id: 4,
            label: 'Инициатор',
            component: (
                <Controller
                    name="initiatorId"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <UserAutocomplete
                                onChange={field.onChange}
                                error={!!errors.initiatorId}
                            />
                            {errors.initiatorId && (
                                <span className={styles.errorText}>
                                    {errors.initiatorId.message}
                                </span>
                            )}
                        </div>
                    )}
                />
            ),
        },
        {
            id: 5,
            label: 'Ответственный',
            component: (
                <Controller
                    name="answerableId"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <UserAutocomplete
                                onChange={field.onChange}
                                error={!!errors.answerableId}
                            />
                            {errors.answerableId && (
                                <span className={styles.errorText}>
                                    {errors.answerableId.message}
                                </span>
                            )}
                        </div>
                    )}
                />
            ),
        },
        {
            id: 6,
            label: 'Исполнитель',
            component: (
                <Controller
                    name="executorId"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <UserAutocomplete
                                onChange={field.onChange}
                                error={!!errors.executorId}
                            />
                            {errors.executorId && (
                                <span className={styles.errorText}>
                                    {errors.executorId.message}
                                </span>
                            )}
                        </div>
                    )}
                />
            ),
        },
        {
            id: 7,
            label: 'Подразделение',
            component: (
                <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <BaseSelect
                                value={field.value}
                                displayEmpty
                                menuItems={[
                                    { id: 0, value: '', title: 'Выберите подразделение' },
                                    ...departmentItems,
                                ]}
                                sx={{
                                    '& .MuiSelect-select': {
                                        color: field.value ? 'white' : '#ffffff80',
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                    },
                                }}
                                onChange={field.onChange}
                                error={!!errors.department}
                                fullWidth
                            />
                            {errors.department && (
                                <span className={styles.errorText}>
                                    {errors.department.message}
                                </span>
                            )}
                        </div>
                    )}
                />
            ),
        },
    ];

    const onTaskCreate = handleSubmit(async (data) => {
        try {
            await tasksApi.createTask({
                name: data.name,
                description: data.description,
                priority: data.priority as TaskPriorityValue,
                executorId: data.executorId,
                answerableId: data.answerableId,
                initiatorId: data.initiatorId,
                department: data.department,
                startDate: data.startDate ?? undefined,
                deadline: data.deadline ?? undefined,
            });

            navigate('/tasks');
        } catch (err) {
            console.error(err);
        }
    });

    return (
        <section className={styles.pageWrapper}>
            <div className={styles.heroForm}>
                <div className={styles.textareaWrapper}>
                    <BaseTextarea
                        placeholder="Введите название задачи"
                        style={{ fontSize: '18px', fontWeight: 500 }}
                        error={!!errors.name}
                        {...register('name')}
                    />
                    {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
                </div>
                <div className={styles.textareaWrapper}>
                    <BaseTextarea
                        minRows={6}
                        placeholder="Введите описание задачи"
                        style={{ fontSize: '15px' }}
                        error={!!errors.description}
                        {...register('description')}
                    />
                    {errors.description && (
                        <span className={styles.errorText}>{errors.description.message}</span>
                    )}
                </div>
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
