import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TasksStatusValue } from '@/types/task/TaskStatus';

export type TaskBase = {
    id: string;
    name: string;
    description: string;
};

export type TaskMeta = {
    status: TasksStatusValue;
    priority: TaskPriorityValue;
    executorId: string;
    answerableId: string;
    initiatorId: string;
};

export type TaskDates = {
    createdAt: string;
    updatedAt: string;
    deadline?: string;
};

export type Task = TaskBase & TaskMeta & TaskDates;
