import type { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';

export type TaskDepartmentValues = keyof typeof DEPARTMENT_LABELS;

export type TaskDepartmentTitle = (typeof DEPARTMENT_LABELS)[TaskDepartmentValues];

export type TaskDepartment = {
    id: number;
    value: TaskDepartmentValues;
    title: TaskDepartmentTitle;
};
