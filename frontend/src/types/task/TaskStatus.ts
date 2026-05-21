export type TaskStatusTitle =
    | 'Черновик'
    | 'Для исполнения'
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
    | 'for_execution'
    | 'revision'
    | 'in_progress'
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
