import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';
import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TasksStatusValue } from '@/types/task/TaskStatus';

export type Comment = {
    id: string;
    text: string;
    taskId: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        firstName: string;
        secondName: string;
    };
};

export type TaskData = {
    id: string;
    name: string;
    description: string;
    status: TasksStatusValue;
    priority: TaskPriorityValue;
    answerableId: string;
    initiatorId: string;
    department: TaskDepartmentValues;
    createdAt: string;
    updatedAt: string;
    startDate?: string;
    deadline?: string;
    executors: {
        id: string;
        firstName: string;
        secondName: string;
    }[];
    answerable: {
        id: string;
        firstName: string;
        secondName: string;
    };
    initiator: {
        id: string;
        firstName: string;
        secondName: string;
    };
    comments: Comment[] | [];
};

export type CreateTaskDto = {
    name: string;
    description: string;
    priority: string;
    executorIds: string[];
    answerableId: string;
    initiatorId: string;
    department: string;
    startDate?: string;
    deadline?: string;
};

export type UpdateTaskDto = {
    name?: string;
    description?: string;
    priority?: string;
    status?: string;
    startDate?: string;
    deadline?: string;
    executorIds?: string[];
    answerableId?: string;
    initiatorId?: string;
    department?: string;
};
