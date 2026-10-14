import type { Department, Specialty, UserRole } from '../../generated/prisma/enums.js';

type Employee = {
    id: string;
    department: Department | null;
    speciality: Specialty | null;
    roles: UserRole;
    isActive: boolean;
};

const departmentSpecialties: Record<Department, Specialty[]> = {
    AUP: ['DEPUTY_HEAD', 'HEAD', 'SERVICE_CHIEF'],
    OUOKR: ['CHIEF_SPECIALIST', 'DEPARTMENT_CHIEF', 'DEPUTY_DEPARTMENT_CHIEF', 'LEAD_SPECIALIST'],
    OKS: ['CHIEF_SPECIALIST', 'DEPARTMENT_CHIEF', 'DEPUTY_DEPARTMENT_CHIEF'],
    YO: ['CHIEF_SPECIALIST', 'DEPARTMENT_CHIEF', 'DEPUTY_DEPARTMENT_CHIEF', 'LEAD_SPECIALIST'],
    OSIOOR: ['CHIEF_SPECIALIST', 'DEPARTMENT_CHIEF', 'DEPUTY_DEPARTMENT_CHIEF', 'LEAD_SPECIALIST'],
    OOEFP: [
        'CHIEF_SPECIALIST_AGRONOMIST',
        'DEPUTY_DEPARTMENT_CHIEF',
        'DRIVER',
        'LEAD_SPECIALIST',
        'LEAD_SPECIALIST_MECHANIC',
        'SPECIALIST_1',
    ],
    PTO: [
        'CHIEF_SPECIALIST',
        'CHIEF_SPECIALIST_LABOR',
        'DEPARTMENT_CHIEF',
        'DEPUTY_DEPARTMENT_CHIEF',
        'DRIVER',
        'LEAD_SPECIALIST',
        'LEAD_SPECIALIST_LABOR',
        'LEAD_SPECIALIST_OPERATOR',
    ],
    OERO: [
        'CHIEF_SPECIALIST',
        'DEPARTMENT_CHIEF',
        'DEPUTY_DEPARTMENT_CHIEF',
        'ELECTRICIAN',
        'LEAD_SPECIALIST_MASTER',
    ],
    OSO: [
        'CHIEF_SPECIALIST_ENGINEER',
        'DEPARTMENT_CHIEF',
        'DEPUTY_DEPARTMENT_CHIEF',
        'LEAD_SPECIALIST_ENGINEER',
        'LOCKSMITH_REPAIRMAN_KIPIA',
    ],
    OOOVVO: [
        'DEPARTMENT_CHIEF',
        'DEPUTY_DEPARTMENT_CHIEF',
        'LEAD_SPECIALIST_MASTER',
        'PLUMBER',
        'WELDER',
    ],
    OOOKHVK: [
        'CHIEF_SPECIALIST_MASTER',
        'DEPARTMENT_CHIEF',
        'DEPUTY_DEPARTMENT_CHIEF',
        'LEAD_SPECIALIST_HVAC',
        'LOCKSMITH_REPAIRMAN_KIPIA',
        'LOCKSMITH_VENTILATION',
    ],
    MP: ['DOCTOR', 'SPECIALIST_1_PARAMEDIC'],
    OOSPB: [
        'CHIEF_SPECIALIST_ENGINEER',
        'DEPARTMENT_CHIEF',
        'DEPUTY_DEPARTMENT_CHIEF',
        'LOCKSMITH_REPAIRMAN',
        'LOCKSMITH_REPAIRMAN_KIPIA',
        'SPECIALIST_1_OPERATOR',
    ],
    OOOR: [
        'CHIEF_SPECIALIST',
        'DEPARTMENT_CHIEF',
        'DEPUTY_DEPARTMENT_CHIEF',
        'LEAD_SPECIALIST',
        'SPECIALIST_1_DUTY',
    ],
    OHO: [
        'ADMINISTRATOR',
        'AUXILIARY_WORKER',
        'CHIEF_SPECIALIST',
        'CHIEF_SPECIALIST_HALF_RATE',
        'CLEANER',
        'DEPARTMENT_CHIEF',
        'DEPUTY_DEPARTMENT_CHIEF',
        'GREEN_WORKER',
        'LEAD_SPECIALIST',
        'LOCKSMITH_REPAIRMAN',
        'PAINTER',
        'SPECIALIST_1',
        'WAREHOUSE_KEEPER',
    ],
};

const chiefSpecialties = new Set<Specialty>(['DEPARTMENT_CHIEF', 'CHIEF_SPECIALIST_AGRONOMIST']);

export function canManageEmployeeSpeciality(actor: Employee | null, target: Employee): boolean {
    return (
        !!actor?.isActive &&
        !!actor.department &&
        !!target.isActive &&
        actor.id !== target.id &&
        actor.department === target.department &&
        target.roles !== 'ADMIN' &&
        !!actor.speciality &&
        chiefSpecialties.has(actor.speciality) &&
        departmentSpecialties[actor.department].includes(actor.speciality) &&
        (!target.speciality || !chiefSpecialties.has(target.speciality))
    );
}

export function canSetEmployeeSpeciality(department: Department, speciality: Specialty): boolean {
    return (
        departmentSpecialties[department].includes(speciality) && !chiefSpecialties.has(speciality)
    );
}

export function getManageableSpecialties(department: Department): Specialty[] {
    return departmentSpecialties[department].filter((speciality) =>
        canSetEmployeeSpeciality(department, speciality),
    );
}
