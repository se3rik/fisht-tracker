import { prisma } from '../lib/prisma.js';

import { TaskStatus, TaskPriority } from '../../generated/prisma/enums.js';

import ApiError from '~/exceptions/api-error.js';

type TaskRole = 'all' | 'executor' | 'answerable' | 'initiator';
type SortOrder = 'asc' | 'desc';

interface GetAllTasksParams {
    userId: string;
    name?: string;
    role?: TaskRole;
    status?: TaskStatus;
    priority?: TaskPriority;
    sortByDate?: SortOrder;
}

interface CreateTaskParams {
    name: string;
    description: string;
    priority: TaskPriority;
    executorId: string;
    answerableId: string;
    initiatorId: string;
    deadline?: string;
}

interface UpdateTaskParams {
    name?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    executorId?: string;
    answerableId?: string;
    deadline?: string;
}

class TaskService {
    async getAllTasks({ userId, name, role, status, priority, sortByDate }: GetAllTasksParams) {
        const roleFilter =
            role === 'executor'
                ? { executorId: userId }
                : role === 'answerable'
                  ? { answerableId: userId }
                  : role === 'initiator'
                    ? { initiatorId: userId }
                    : {};

        return prisma.task.findMany({
            where: {
                ...roleFilter,
                ...(name && { name: { contains: name, mode: 'insensitive' } }),
                ...(status && { status }),
                ...(priority && { priority }),
            },
            orderBy: {
                createdAt: sortByDate ?? 'desc',
            },
            include: {
                executor: { select: { id: true, firstName: true, secondName: true } },
                answerable: { select: { id: true, firstName: true, secondName: true } },
                initiator: { select: { id: true, firstName: true, secondName: true } },
            },
        });
    }

    async getTaskById(id: string) {
        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                executor: { select: { id: true, firstName: true, secondName: true } },
                answerable: { select: { id: true, firstName: true, secondName: true } },
                initiator: { select: { id: true, firstName: true, secondName: true } },
                comments: {
                    include: {
                        author: { select: { id: true, firstName: true, secondName: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!task) throw ApiError.NotFound('Задача не найдена');

        return task;
    }

    async createTask(params: CreateTaskParams) {
        return prisma.task.create({
            data: {
                ...params,
                deadline: params.deadline ? new Date(params.deadline) : undefined,
            },
        });
    }

    async updateTask(id: string, data: UpdateTaskParams) {
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) throw ApiError.NotFound('Задача не найдена');

        return prisma.task.update({
            where: { id },
            data: {
                ...data,
                deadline: data.deadline ? new Date(data.deadline) : undefined,
            },
        });
    }

    async deleteTask(id: string, userId: string, userRole: string) {
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) throw ApiError.NotFound('Задача не найдена');

        const isInitiator = task.initiatorId === userId;
        const isAdmin = userRole === 'ADMIN';

        if (!isInitiator && !isAdmin) {
            throw ApiError.Forbidden('Недостаточно прав для удаления задачи');
        }

        return prisma.task.update({
            where: { id },
            data: { status: TaskStatus.ARCHIVE },
        });
    }
}

export default new TaskService();
