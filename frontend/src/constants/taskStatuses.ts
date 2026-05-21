import type { TasksStatusValue, TaskStatus, TaskStatusTitle } from '@/types/task/TaskStatus';

export const taskStatuses: TaskStatus[] = [
    { id: 1, value: 'draft', title: 'Черновик' },
    { id: 2, value: 'for_execution', title: 'Для исполнения' },
    { id: 3, value: 'revision', title: 'На уточнении' },
    { id: 4, value: 'in_progress', title: 'В работе' },
    { id: 5, value: 'suspended', title: 'Приостановлена' },
    { id: 6, value: 'completed', title: 'Выполнена' },
    { id: 7, value: 'rework', title: 'На доработке' },
    { id: 8, value: 'finished', title: 'Завершена' },
    { id: 9, value: 'canceled', title: 'Отменена' },
    { id: 10, value: 'archive', title: 'Архив' },
];

export const TASK_STATUS_CONFIG: Record<
    Exclude<TasksStatusValue, ''>,
    {
        label: TaskStatusTitle;
        bgcolor: string;
        color: string;
    }
> = {
    draft: {
        label: 'Черновик',
        bgcolor: '#f3f4f6',
        color: '#374151',
    },

    for_execution: {
        label: 'Для исполнения',
        bgcolor: '#3c75e6',
        color: '#fdfeff',
    },

    in_progress: {
        label: 'В работе',
        bgcolor: '#e0f2fe',
        color: '#075985',
    },

    completed: {
        label: 'Выполнена',
        bgcolor: '#dcfce7',
        color: '#166534',
    },

    canceled: {
        label: 'Отменена',
        bgcolor: '#fee2e2',
        color: '#991b1b',
    },

    revision: {
        label: 'На уточнении',
        bgcolor: '#fef3c7',
        color: '#92400e',
    },

    suspended: {
        label: 'Приостановлена',
        bgcolor: '#fef3c7',
        color: '#92400e',
    },

    rework: {
        label: 'На доработке',
        bgcolor: '#fef3c7',
        color: '#92400e',
    },

    finished: {
        label: 'Завершена',
        bgcolor: '#dcfce7',
        color: '#166534',
    },

    archive: {
        label: 'Архив',
        bgcolor: '#f3f4f6',
        color: '#6b7280',
    },
};
