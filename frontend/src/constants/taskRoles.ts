import type { TaskRole } from '@/types/task/TaskRole';

export const taskRoles: TaskRole[] = [
    { id: 1, value: 'all', title: 'Все задачи' },
    { id: 2, value: 'executor', title: 'Я исполнитель' },
    { id: 3, value: 'answerable', title: 'Я ответственный' },
    { id: 4, value: 'initiator', title: 'Я инициатор' },
];
