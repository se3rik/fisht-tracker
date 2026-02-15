import type { TaskStatus } from '@/types/task/TaskStatus';

export const taskStatuses: TaskStatus[] = [
    { id: 1, value: 'draft', title: 'Черновик' },
    { id: 2, value: 'revision', title: 'На уточнении' },
    { id: 3, value: 'in-progress', title: 'В работе' },
    { id: 4, value: 'suspended', title: 'Приостановлена' },
    { id: 5, value: 'completed', title: 'Выполнена' },
    { id: 6, value: 'rework', title: 'На доработке' },
    { id: 7, value: 'finished', title: 'Завершена' },
    { id: 8, value: 'canceled', title: 'Отменена' },
    { id: 9, value: 'archive', title: 'Архив' },
];
