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

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [priority, setPriority] = useState<TaskPriorityValue>('');
    const [status, setStatus] = useState<TasksStatusValue>('');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [deadline, setDeadline] = useState<Dayjs | null>(null);
    const [executorId, setExecutorId] = useState('');
    const [answerableId, setAnswerableId] = useState('');
    const [initiatorId, setInitiatorId] = useState('');
    const [executor, setExecutor] = useState<UserSearchResult | null>(null);
    const [answerable, setAnswerable] = useState<UserSearchResult | null>(null);
    const [initiator, setInitiator] = useState<UserSearchResult | null>(null);
    const [department, setDepartment] = useState<TaskDepartmentValues | ''>('');

    const departmentItems = Object.entries(DEPARTMENT_LABELS).map(([value, title], id) => ({
        id,
        value,
        title,
    }));

    const canEdit = profileData?.roles === 'ADMIN' || profileData?.id === originalInitiatorId;

    const handleStartEditing = () => {
        if (!taskData) return;
        setTaskName(taskData.name);
        setTaskDescription(taskData.description);
        setPriority(taskData.priority as TaskPriorityValue);
        setStatus(taskData.status.toLowerCase() as TasksStatusValue);
        setStartDate(taskData.startDate ? dayjs(taskData.startDate) : null);
        setDeadline(taskData.deadline ? dayjs(taskData.deadline) : null);
        setExecutorId(taskData.executorId);
        setAnswerableId(taskData.answerableId);
        setInitiatorId(taskData.initiatorId);
        setExecutor(taskData.executor);
        setAnswerable(taskData.answerable);
        setInitiator(taskData.initiator);
        setDepartment(taskData.department);
        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!taskData) return;
        try {
            await tasksApi.updateTask(taskData.id, {
                name: taskName,
                description: taskDescription,
                priority,
                status: status.toUpperCase(),
                startDate: startDate ? startDate.toISOString() : undefined,
                deadline: deadline ? deadline.toISOString() : undefined,
                executorId,
                answerableId,
                initiatorId: initiatorId || taskData.initiatorId,
                department,
            });

            setTaskData((prev) =>
                prev
                    ? {
                          ...prev,
                          name: taskName,
                          description: taskDescription,
                          priority,
                          status,
                          startDate: startDate ? startDate.toISOString() : undefined,
                          deadline: deadline ? deadline.toISOString() : undefined,
                          executorId,
                          answerableId,
                          initiatorId,
                          department: department as TaskDepartmentValues,
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
    };

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
                <BaseSelect
                    value={isEditing ? priority : taskData?.priority}
                    menuItems={taskPriorities}
                    disabled={!isEditing}
                    onChange={setPriority}
                    fullWidth
                />
            ),
        },
        {
            id: 2,
            label: 'Статус',
            component: (
                <BaseSelect
                    value={
                        isEditing ? status : (taskData?.status.toLowerCase() as TasksStatusValue)
                    }
                    menuItems={taskStatuses}
                    disabled={!isEditing}
                    onChange={setStatus}
                    fullWidth
                />
            ),
        },
        {
            id: 3,
            label: 'Дата начала',
            component: (
                <BaseDatePicker
                    value={
                        isEditing
                            ? startDate
                            : taskData?.startDate
                              ? dayjs(taskData.startDate)
                              : null
                    }
                    disabled={!isEditing}
                    onChange={(newValue) => setStartDate(newValue)}
                />
            ),
        },
        {
            id: 4,
            label: 'Дедлайн',
            component: (
                <BaseDatePicker
                    value={
                        isEditing ? deadline : taskData?.deadline ? dayjs(taskData.deadline) : null
                    }
                    disabled={!isEditing}
                    onChange={(newValue) => setDeadline(newValue)}
                />
            ),
        },
        {
            id: 5,
            label: 'Инициатор',
            component: (
                <UserAutocomplete
                    disabled={!isEditing}
                    value={isEditing ? initiator : (taskData?.initiator ?? null)}
                    onChange={(id) => setInitiatorId(id)}
                    onChangeUser={(user) => setInitiator(user)}
                />
            ),
        },
        {
            id: 6,
            label: 'Ответственный',
            component: (
                <UserAutocomplete
                    disabled={!isEditing}
                    value={isEditing ? answerable : (taskData?.answerable ?? null)}
                    onChange={(id) => setAnswerableId(id)}
                    onChangeUser={(user) => setAnswerable(user)}
                />
            ),
        },
        {
            id: 7,
            label: 'Исполнитель',
            component: (
                <UserAutocomplete
                    disabled={!isEditing}
                    value={isEditing ? executor : (taskData?.executor ?? null)}
                    onChange={(id) => setExecutorId(id)}
                    onChangeUser={(user) => setExecutor(user)}
                />
            ),
        },
        {
            id: 8,
            label: 'Подразделение',
            component: (
                <BaseSelect
                    value={isEditing ? department : taskData?.department}
                    disabled={!isEditing}
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
                    onChange={(value: string) => setDepartment(value as TaskDepartmentValues | '')}
                    fullWidth
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
                            {/* <h1 className={styles.taskTitle}>{taskData.name}</h1>
                            <span className={styles.taskDescription}>{taskData.description}</span> */}
                            <BaseTextarea
                                placeholder="Введите название задачи"
                                value={isEditing ? taskName : taskData?.name}
                                onChange={(e) => setTaskName(e.target.value)}
                                disabled={!isEditing}
                                style={{ fontSize: '18px', fontWeight: 500 }}
                            />
                            <BaseTextarea
                                minRows={6}
                                value={isEditing ? taskDescription : taskData?.description}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                placeholder="Введите описание задачи"
                                disabled={!isEditing}
                                style={{ fontSize: '15px' }}
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
