export type TaskStatusTitle =
    | 'Черновик'
    | 'На уточнении'
    | 'В работе'
    | 'Приостановлена'
    | 'Выполнена'
    | 'На доработке'
    | 'Завершена'
    | 'Отменена'
    | 'Архив';

export type TasksStatusValue =
    | 'draft'
    | 'revision'
    | 'in-progress'
    | 'suspended'
    | 'completed'
    | 'rework'
    | 'finished'
    | 'canceled'
    | 'archive'
    | '';

export type TaskStatus = {
    id: number;
    value: TasksStatusValue | '';
    title: TaskStatusTitle;
};
