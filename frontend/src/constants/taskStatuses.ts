import type { TasksStatusValue, TaskStatus, TaskStatusTitle } from '@/types/task/TaskStatus';

export const taskStatuses: TaskStatus[] = [
    { id: 1, value: 'draft', title: 'Черновик' },
    { id: 2, value: 'revision', title: 'На уточнении' },
    { id: 3, value: 'in_progress', title: 'В работе' },
    { id: 4, value: 'suspended', title: 'Приостановлена' },
    { id: 5, value: 'completed', title: 'Выполнена' },
    { id: 6, value: 'rework', title: 'На доработке' },
    { id: 7, value: 'finished', title: 'Завершена' },
    { id: 8, value: 'canceled', title: 'Отменена' },
    { id: 9, value: 'archive', title: 'Архив' },
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
