import { prisma } from '../lib/prisma.js';
import ApiError from '~/exceptions/api-error.js';
import { Department, GoalStatus, TaskStatus } from '../../generated/prisma/enums.js';
import type { Specialty, UserRole } from '../../generated/prisma/enums.js';

type GoalInput = {
    title?: string;
    description?: string;
    department?: Department;
    deadline?: string | null;
    status?: GoalStatus;
    taskIds?: string[];
};

type Actor = {
    id: string;
    department: Department | null;
    speciality: Specialty | null;
    roles: UserRole;
    isActive: boolean;
};

const chiefs = new Set<Specialty>(['DEPARTMENT_CHIEF', 'CHIEF_SPECIALIST_AGRONOMIST']);

const canManage = (actor: Actor, department: Department) =>
    actor.isActive &&
    (actor.roles === 'ADMIN' ||
        (actor.department === department && !!actor.speciality && chiefs.has(actor.speciality)));

const goalInclude = {
    creator: { select: { id: true, firstName: true, secondName: true } },
    tasks: { select: { id: true, name: true, status: true } },
} as const;

const withProgress = <T extends { tasks: { status: string }[] }>(goal: T) => ({
    ...goal,
    progress: goal.tasks.length
        ? Math.round(
              (goal.tasks.filter((task) => task.status === 'FINISHED').length / goal.tasks.length) *
                  100,
          )
        : 0,
});

class GoalService {
    private async actor(userId: string) {
        const actor = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, department: true, speciality: true, roles: true, isActive: true },
        });
        if (!actor?.isActive) throw ApiError.Forbidden('Нет доступа к управлению целями');
        return actor;
    }

    private async validateTasks(taskIds: string[], department: Department) {
        if (!Array.isArray(taskIds) || taskIds.some((id) => typeof id !== 'string')) {
            throw ApiError.BadRequest('Некорректный список задач');
        }
        const ids = [...new Set(taskIds)];
        const count = await prisma.task.count({ where: { id: { in: ids }, department } });
        if (count !== ids.length)
            throw ApiError.BadRequest('Можно добавить только задачи отдела цели');
        return ids;
    }

    private validateFields(data: GoalInput) {
        if (data.department !== undefined && !Object.values(Department).includes(data.department)) {
            throw ApiError.BadRequest('Некорректный отдел');
        }
        if (
            data.title !== undefined &&
            (typeof data.title !== 'string' || !data.title.trim() || data.title.length > 160)
        ) {
            throw ApiError.BadRequest('Название цели должно содержать от 1 до 160 символов');
        }
        if (
            data.description !== undefined &&
            (typeof data.description !== 'string' ||
                !data.description.trim() ||
                data.description.length > 3000)
        ) {
            throw ApiError.BadRequest('Описание цели должно содержать от 1 до 3000 символов');
        }
        if (
            data.deadline !== undefined &&
            data.deadline !== null &&
            (typeof data.deadline !== 'string' || Number.isNaN(Date.parse(data.deadline)))
        ) {
            throw ApiError.BadRequest('Некорректный срок цели');
        }
        if (data.status !== undefined && !Object.values(GoalStatus).includes(data.status)) {
            throw ApiError.BadRequest('Некорректный статус цели');
        }
    }

    async list() {
        const goals = await prisma.goal.findMany({
            include: goalInclude,
            orderBy: [{ status: 'asc' }, { deadline: 'asc' }, { createdAt: 'desc' }],
        });
        return goals.map(withProgress);
    }

    async taskOptions(department: Department) {
        return prisma.task.findMany({
            where: { department },
            select: { id: true, name: true, status: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(userId: string, data: GoalInput) {
        const actor = await this.actor(userId);
        if (!data.department || !canManage(actor, data.department)) {
            throw ApiError.Forbidden(
                'Создавать цели может начальник своего отдела или администратор',
            );
        }
        this.validateFields(data);
        if (!data.title || !data.description)
            throw ApiError.BadRequest('Укажите название и описание цели');
        if (!data.deadline) throw ApiError.BadRequest('Укажите срок цели');
        if (!data.taskIds?.length) throw ApiError.BadRequest('Добавьте хотя бы одну задачу к цели');
        const taskIds = await this.validateTasks(data.taskIds ?? [], data.department);
        const goal = await prisma.goal.create({
            data: {
                title: data.title.trim(),
                description: data.description.trim(),
                department: data.department,
                deadline: data.deadline ? new Date(data.deadline) : null,
                creatorId: userId,
                tasks: { connect: taskIds.map((id) => ({ id })) },
            },
            include: goalInclude,
        });
        return withProgress(goal);
    }

    async update(userId: string, goalId: string, data: GoalInput) {
        const actor = await this.actor(userId);
        const existing = await prisma.goal.findUnique({ where: { id: goalId } });
        if (!existing) throw ApiError.NotFound('Цель не найдена');
        if (!canManage(actor, existing.department)) {
            throw ApiError.Forbidden('Изменять цель может начальник её отдела или администратор');
        }
        if (data.department && data.department !== existing.department) {
            throw ApiError.BadRequest('Отдел цели изменить нельзя');
        }
        this.validateFields(data);
        if (data.deadline === null || data.deadline === '') {
            throw ApiError.BadRequest('Укажите срок цели');
        }
        if (data.taskIds !== undefined && (!Array.isArray(data.taskIds) || data.taskIds.length === 0)) {
            throw ApiError.BadRequest('Добавьте хотя бы одну задачу к цели');
        }
        const taskIds =
            data.taskIds === undefined
                ? undefined
                : await this.validateTasks(data.taskIds, existing.department);
        if ((data.status ?? existing.status) === GoalStatus.ARCHIVED) {
            const archiveTasks = await prisma.task.findMany({
                where: taskIds
                    ? { id: { in: taskIds } }
                    : { goals: { some: { id: goalId } } },
                select: { status: true },
            });
            if (!archiveTasks.length || archiveTasks.some((task) => task.status !== TaskStatus.FINISHED)) {
                throw ApiError.BadRequest(
                    'Перенести цель в архив можно только после завершения всех связанных задач',
                );
            }
        }
        const goal = await prisma.goal.update({
            where: { id: goalId },
            data: {
                title: data.title?.trim(),
                description: data.description?.trim(),
                deadline:
                    data.deadline === undefined
                        ? undefined
                        : data.deadline
                          ? new Date(data.deadline)
                          : null,
                status: data.status,
                tasks: taskIds ? { set: taskIds.map((id) => ({ id })) } : undefined,
            },
            include: goalInclude,
        });
        return withProgress(goal);
    }
}

export default new GoalService();
