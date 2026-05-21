export type TaskRoleValue = 'all' | 'executor' | 'answerable' | 'initiator' | '';

export type TaskRoleTitle = 'Все задачи' | 'Я исполнитель' | 'Я ответственный' | 'Я инициатор';

export type TaskRole = {
    id: number;
    value: TaskRoleValue;
    title: TaskRoleTitle;
};
