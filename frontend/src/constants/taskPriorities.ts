import type { TaskPriority, TaskPriorityTitle, TaskPriorityValue } from '@/types/task/TaskPriority';

export const taskPriorities: TaskPriority[] = [
    { id: 1, value: 'P1', title: 'Критичный' },
    { id: 2, value: 'P2', title: 'Высокий' },
    { id: 3, value: 'P3', title: 'Средний' },
    { id: 4, value: 'P4', title: 'Низкий' },
];

export const TASK_PRIORITY_CONFIG: Record<
    Exclude<TaskPriorityValue, ''>,
    {
        label: TaskPriorityTitle;
        bgcolor: string;
        color: string;
    }
> = {
    P1: {
        label: 'Критичный',
        bgcolor: 'transparent',
        color: '#dc2626',
    },

    P2: {
        label: 'Высокий',
        bgcolor: 'transparent',
        color: '#ea580c',
    },

    P3: {
        label: 'Средний',
        bgcolor: 'transparent',
        color: '#2563eb',
    },

    P4: {
        label: 'Низкий',
        bgcolor: 'transparent',
        color: '#6b7280',
    },
};
