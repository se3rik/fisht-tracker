import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

export const taskDepartments = Object.entries(DEPARTMENT_LABELS).map(([value, title], index) => ({
    id: index + 1,
    value: value as TaskDepartmentValues,
    title,
}));
