import { prisma } from '../lib/prisma.js';

import ApiError from '~/exceptions/api-error.js';

import { TaskStatus } from '../../generated/prisma/enums.js';
import type { Prisma } from '../../generated/prisma/client.js';
import type { GetAllTasksParams, CreateTaskParams, UpdateTaskParams } from '~/types/tasks.js';
import { canAssignTask } from './task-assignment.js';

class TaskService {
    async getAllTasks({
        userId,
        name,
        role,
        status,
        department,
        priority,
        sortByDate,
        sortByDeadline,
        limit,
        skip,
    }: GetAllTasksParams) {
        const roleFilter =
            role === 'executor'
                ? { executors: { some: { id: userId } } }
                : role === 'answerable'
                  ? { answerableId: userId }
                  : role === 'initiator'
                    ? { initiatorId: userId }
                    : {};

        const where: Prisma.TaskWhereInput = {
            ...roleFilter,
            ...(name && { name: { contains: name, mode: 'insensitive' } }),
            ...(status && { status }),
            ...(department && { department }),
            ...(priority && { priority }),
        };

        const orderBy: Prisma.TaskOrderByWithRelationInput[] = [];

        if (sortByDeadline) {
            orderBy.push({ deadline: sortByDeadline });
        }

        if (sortByDate) {
            orderBy.push({ createdAt: sortByDate });
        }

        if (orderBy.length === 0) {
            orderBy.push({ createdAt: 'desc' });
        }

        const [tasks, total] = await prisma.$transaction([
            prisma.task.findMany({
                where,
                orderBy,
                take: limit,
                skip,
                select: {
                    id: true,
                    name: true,
                    status: true,
                    priority: true,
                    department: true,
                    createdAt: true,
                    deadline: true,
                    executors: {
                        select: {
                            firstName: true,
                            secondName: true,
                        },
                    },
                },
            }),
            prisma.task.count({ where }),
        ]);

        return { tasks, total };
    }

    async getTaskById(id: string) {
        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                executors: { select: { id: true, firstName: true, secondName: true } },
                answerable: { select: { id: true, firstName: true, secondName: true } },
                initiator: { select: { id: true, firstName: true, secondName: true } },
                comments: {
                    include: {
                        author: { select: { id: true, firstName: true, secondName: true } },
                        attachments: {
                            select: { id: true, fileName: true, mimeType: true, size: true },
                            orderBy: { createdAt: 'asc' },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!task) throw ApiError.NotFound('Задача не найдена');

        return task;
    }

    async createTask(params: CreateTaskParams, userId: string) {
        const { executorIds, startDate, deadline, initiatorId: _initiatorId, ...rest } = params;
        const creator = await prisma.user.findUnique({ where: { id: userId } });
        if (!creator?.department || !creator.speciality || !creator.isActive) {
            throw ApiError.Forbidden('Укажите подразделение и должность в профиле');
        }
        if (!Array.isArray(executorIds) || !executorIds.length || typeof params.answerableId !== 'string') {
            throw ApiError.BadRequest('Укажите ответственного и исполнителей');
        }
        const recipients = [...new Set([params.answerableId, ...executorIds])];
        if (recipients.some((id) => typeof id !== 'string')) {
            throw ApiError.BadRequest('Некорректные исполнители');
        }
        const users = await prisma.user.findMany({ where: { id: { in: recipients } } });
        if (users.length !== recipients.length || users.some((user) => !canAssignTask(creator, user))) {
            throw ApiError.Forbidden('Назначать задачи можно только другим сотрудникам своего или более низкого уровня в своём подразделении');
        }

        return prisma.task.create({
            data: {
                ...rest,
                department: creator.department,
                initiatorId: userId,
                executors: { connect: executorIds.map((id) => ({ id })) },
                startDate: startDate ? new Date(startDate) : undefined,
                deadline: deadline ? new Date(deadline) : undefined,
            },
            select: {
                id: true,
                name: true,
                description: true,
                status: true,
                priority: true,
                department: true,
                startDate: true,
                deadline: true,
                executors: {
                    select: { id: true, firstName: true, secondName: true },
                },
                answerableId: true,
                initiatorId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async updateTask(id: string, data: UpdateTaskParams, userId: string) {
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) throw ApiError.NotFound('Задача не найдена');

        const actor = await prisma.user.findUnique({ where: { id: userId } });
        if (!actor || ((data.executorIds || data.answerableId) && actor.id !== task.initiatorId && actor.roles !== 'ADMIN')) {
            throw ApiError.Forbidden('Изменять назначение может только инициатор задачи');
        }

        if (data.executorIds || data.answerableId) {
            const creator = await prisma.user.findUnique({ where: { id: task.initiatorId } });
            const recipients = [...new Set([data.answerableId ?? task.answerableId, ...(data.executorIds ?? [])])];
            const users = await prisma.user.findMany({ where: { id: { in: recipients } } });
            if (!creator || users.length !== recipients.length || users.some((user) => !canAssignTask(creator, user))) {
                throw ApiError.Forbidden('Назначать задачи можно только другим сотрудникам своего или более низкого уровня в подразделении инициатора');
            }
        }

        if (data.department && data.department !== task.department) {
            throw ApiError.Forbidden('Подразделение задачи изменить нельзя');
        }

        const { executorIds, deadline, name, description, status, priority, answerableId } = data;

        return prisma.task.update({
            where: { id },
            data: {
                name,
                description,
                status,
                priority,
                answerableId,
                ...(executorIds && {
                    executors: { set: executorIds.map((id) => ({ id })) },
                }),
                deadline: deadline ? new Date(deadline) : undefined,
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
