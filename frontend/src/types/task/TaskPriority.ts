export type TaskPriorityValue = 'P1' | 'P2' | 'P3' | 'P4' | '';

export type TaskPriorityTitle = 'Критичный' | 'Высокий' | 'Средний' | 'Низкий';

export type TaskPriority = {
    id: number;
    value: TaskPriorityValue;
    title: TaskPriorityTitle;
};
