import { useState } from 'react';
import { useParams } from 'react-router';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import dayjs, { type Dayjs } from 'dayjs';

import styles from './TaskDetailsPage.module.scss';

import { tasksApi } from '@/api';

import { BaseTextarea } from '@/components/ui/BaseTextarea/BaseTextarea';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';
import { BaseDatePicker } from '@/components/ui/BaseDatePicker/BaseDatePicker';
import { CommentaryList } from '@/components/comment/CommentaryList/CommentaryList';
import { UserAutocomplete } from '@/components/userAutocomplete/UsersAutocomplete';

import { useTasksItem } from '@/hooks/useTaskItem';
import { useAppSelector } from '@/hooks/useAppSelector';

import { taskPriorities } from '@/constants/taskPriorities';
import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';

import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TasksStatusValue } from '@/types/task/TaskStatus';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';
import type { UserSearchResult } from '@/api/users.api';
import { taskStatuses } from '@/constants/taskStatuses';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateTaskValidationSchema } from '@/validation/taskValidation';

type TaskUpdateForm = {
    name: string;
    description: string;
    priority: string;
    status: string;
    executorId: string;
    answerableId: string;
    initiatorId: string;
    department: string;
    startDate: string | null;
    deadline: string | null;
};

export const TaskDetailsPage = () => {
    const urlParams = useParams();
    const { taskData, setTaskData } = useTasksItem(urlParams.id ?? '');
    const { profileData } = useAppSelector((state) => state.profile);

    const [originalInitiatorId, setOriginalInitiatorId] = useState<string | null>(null);
    if (taskData && !originalInitiatorId) {
        setOriginalInitiatorId(taskData.initiatorId);
    }

    const [isEditing, setIsEditing] = useState(false);
    const [commentValue, setCommentValue] = useState('');

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<TaskUpdateForm>({
        defaultValues: {
            name: '',
            description: '',
            priority: '',
            status: '',
            executorId: '',
            answerableId: '',
            initiatorId: '',
            department: '',
            startDate: null,
            deadline: null,
        },
        resolver: yupResolver(updateTaskValidationSchema),
    });

    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [deadline, setDeadline] = useState<Dayjs | null>(null);
    const [executor, setExecutor] = useState<UserSearchResult | null>(null);
    const [answerable, setAnswerable] = useState<UserSearchResult | null>(null);
    const [initiator, setInitiator] = useState<UserSearchResult | null>(null);

    const departmentItems = Object.entries(DEPARTMENT_LABELS).map(([value, title], id) => ({
        id,
        value,
        title,
    }));

    const canEdit = profileData?.roles === 'ADMIN' || profileData?.id === originalInitiatorId;

    const handleStartEditing = () => {
        if (!taskData) return;
        reset({
            name: taskData.name,
            description: taskData.description,
            priority: taskData.priority,
            status: taskData.status.toLowerCase(),
            executorId: taskData.executorId,
            answerableId: taskData.answerableId,
            initiatorId: taskData.initiatorId,
            department: taskData.department,
            startDate: taskData.startDate ?? null,
            deadline: taskData.deadline ?? null,
        });
        setExecutor(taskData.executor);
        setAnswerable(taskData.answerable);
        setInitiator(taskData.initiator);
        setStartDate(taskData.startDate ? dayjs(taskData.startDate) : null);
        setDeadline(taskData.deadline ? dayjs(taskData.deadline) : null);
        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        reset({
            name: taskData?.name ?? '',
            description: taskData?.description ?? '',
            priority: taskData?.priority ?? '',
            status: taskData?.status.toLowerCase() ?? '',
            executorId: taskData?.executorId ?? '',
            answerableId: taskData?.answerableId ?? '',
            initiatorId: taskData?.initiatorId ?? '',
            department: taskData?.department ?? '',
            startDate: taskData?.startDate ?? null,
            deadline: taskData?.deadline ?? null,
        });
        setIsEditing(false);
    };

    const handleSave = handleSubmit(async (formData) => {
        if (!taskData) return;
        try {
            await tasksApi.updateTask(taskData.id, {
                name: formData.name,
                description: formData.description,
                priority: formData.priority,
                status: formData.status.toUpperCase(),
                startDate: startDate ? startDate.toISOString() : undefined,
                deadline: deadline ? deadline.toISOString() : undefined,
                executorId: formData.executorId,
                answerableId: formData.answerableId,
                initiatorId: formData.initiatorId || taskData.initiatorId,
                department: formData.department,
            });

            setTaskData((prev) =>
                prev
                    ? {
                          ...prev,
                          name: formData.name,
                          description: formData.description,
                          priority: formData.priority as TaskPriorityValue,
                          status: formData.status as TasksStatusValue,
                          startDate: startDate ? startDate.toISOString() : undefined,
                          deadline: deadline ? deadline.toISOString() : undefined,
                          executorId: formData.executorId,
                          answerableId: formData.answerableId,
                          initiatorId: formData.initiatorId,
                          department: formData.department as TaskDepartmentValues,
                          executor: executor ?? prev.executor,
                          answerable: answerable ?? prev.answerable,
                          initiator: initiator ?? prev.initiator,
                      }
                    : prev,
            );

            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    });

    const handleSendComment = async () => {
        if (!commentValue.trim()) return;
        try {
            const newComment = await tasksApi.createComment(urlParams.id ?? '', commentValue);
            setCommentValue('');
            setTaskData((prev) =>
                prev ? { ...prev, comments: [...prev.comments, newComment] } : prev,
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await tasksApi.deleteComment(urlParams.id ?? '', commentId);
            setTaskData((prev) =>
                prev
                    ? { ...prev, comments: prev.comments.filter((c) => c.id !== commentId) }
                    : prev,
            );
        } catch (err) {
            console.error(err);
        }
    };

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
                                value={isEditing ? field.value : (taskData?.priority ?? '')}
                                menuItems={taskPriorities}
                                disabled={!isEditing}
                                error={!!errors.priority}
                                onChange={field.onChange}
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
            label: 'Статус',
            component: (
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <BaseSelect
                                value={
                                    isEditing
                                        ? field.value
                                        : (taskData?.status.toLowerCase() as TasksStatusValue)
                                }
                                menuItems={taskStatuses}
                                disabled={!isEditing}
                                error={!!errors.status}
                                onChange={field.onChange}
                                fullWidth
                            />
                            {errors.status && (
                                <span className={styles.errorText}>{errors.status.message}</span>
                            )}
                        </div>
                    )}
                />
            ),
        },
        {
            id: 3,
            label: 'Дата начала',
            component: (
                <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                        <BaseDatePicker
                            value={
                                isEditing
                                    ? startDate
                                    : taskData?.startDate
                                      ? dayjs(taskData.startDate)
                                      : null
                            }
                            disabled={!isEditing}
                            onChange={(newValue) => {
                                setStartDate(newValue);
                                field.onChange(newValue ? newValue.toISOString() : null);
                            }}
                        />
                    )}
                />
            ),
        },
        {
            id: 4,
            label: 'Дедлайн',
            component: (
                <Controller
                    name="deadline"
                    control={control}
                    render={({ field }) => (
                        <BaseDatePicker
                            value={
                                isEditing
                                    ? deadline
                                    : taskData?.deadline
                                      ? dayjs(taskData.deadline)
                                      : null
                            }
                            disabled={!isEditing}
                            onChange={(newValue) => {
                                setDeadline(newValue);
                                field.onChange(newValue ? newValue.toISOString() : null);
                            }}
                        />
                    )}
                />
            ),
        },
        {
            id: 5,
            label: 'Инициатор',
            component: (
                <Controller
                    name="initiatorId"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <UserAutocomplete
                                disabled={!isEditing}
                                value={isEditing ? initiator : (taskData?.initiator ?? null)}
                                error={!!errors.initiatorId}
                                onChange={(id) => {
                                    field.onChange(id);
                                }}
                                onChangeUser={(user) => setInitiator(user)}
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
            id: 6,
            label: 'Ответственный',
            component: (
                <Controller
                    name="answerableId"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <UserAutocomplete
                                disabled={!isEditing}
                                value={isEditing ? answerable : (taskData?.answerable ?? null)}
                                error={!!errors.answerableId}
                                onChange={(id) => {
                                    field.onChange(id);
                                }}
                                onChangeUser={(user) => setAnswerable(user)}
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
            id: 7,
            label: 'Исполнитель',
            component: (
                <Controller
                    name="executorId"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <UserAutocomplete
                                disabled={!isEditing}
                                value={isEditing ? executor : (taskData?.executor ?? null)}
                                error={!!errors.executorId}
                                onChange={(id) => {
                                    field.onChange(id);
                                }}
                                onChangeUser={(user) => setExecutor(user)}
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
            id: 8,
            label: 'Подразделение',
            component: (
                <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <BaseSelect
                                value={isEditing ? field.value : (taskData?.department ?? '')}
                                disabled={!isEditing}
                                displayEmpty
                                error={!!errors.department}
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

    return (
        <section className={styles.pageWrapper}>
            {taskData && (
                <>
                    <div className={styles.heroBlock}>
                        <section className={styles.heroSection}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <div className={styles.textareaWrapper}>
                                        <BaseTextarea
                                            placeholder="Введите название задачи"
                                            value={isEditing ? field.value : taskData?.name}
                                            onChange={field.onChange}
                                            disabled={!isEditing}
                                            error={!!errors.name}
                                            style={{ fontSize: '18px', fontWeight: 500 }}
                                        />
                                        {errors.name && (
                                            <span className={styles.errorText}>
                                                {errors.name.message}
                                            </span>
                                        )}
                                    </div>
                                )}
                            />
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <div className={styles.textareaWrapper}>
                                        <BaseTextarea
                                            minRows={6}
                                            placeholder="Введите описание задачи"
                                            value={isEditing ? field.value : taskData?.description}
                                            onChange={field.onChange}
                                            disabled={!isEditing}
                                            error={!!errors.description}
                                            style={{ fontSize: '15px' }}
                                        />
                                        {errors.description && (
                                            <span className={styles.errorText}>
                                                {errors.description.message}
                                            </span>
                                        )}
                                    </div>
                                )}
                            />
                        </section>

                        <section className={styles.commentSection}>
                            <span>Комментарии</span>
                            <CommentaryList
                                commentaryList={taskData.comments}
                                currentUserId={profileData?.id ?? ''}
                                isAdmin={profileData?.roles === 'ADMIN'}
                                onDeleteComment={handleDeleteComment}
                            />
                            <div className={styles.commentAreaWrapper}>
                                <BaseTextarea
                                    minRows={4}
                                    placeholder="Комментарий"
                                    value={commentValue}
                                    onChange={(e) => setCommentValue(e.target.value)}
                                    style={{ paddingBottom: '46px' }}
                                />
                                {commentValue && (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleSendComment}
                                        startIcon={<SendIcon />}
                                        sx={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            right: '6px',
                                        }}
                                    >
                                        Отправить
                                    </Button>
                                )}
                            </div>
                        </section>

                        {canEdit && (
                            <div className={styles.taskInfoButtons}>
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={handleSave}
                                        >
                                            Сохранить
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCancelEditing}
                                        >
                                            Отменить
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleStartEditing}
                                    >
                                        Редактировать
                                    </Button>
                                )}
                            </div>
                        )}
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
                </>
            )}
        </section>
    );
};
