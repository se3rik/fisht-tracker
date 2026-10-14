import assert from 'node:assert/strict';
import test from 'node:test';

import {
    canManageEmployeeSpeciality,
    canSetEmployeeSpeciality,
    getManageableSpecialties,
} from '../src/services/employee-speciality-policy.js';

const chief = {
    id: 'chief',
    department: 'OSO',
    speciality: 'DEPARTMENT_CHIEF',
    roles: 'USER',
    isActive: true,
} as const;

const employee = {
    id: 'employee',
    department: 'OSO',
    speciality: 'LEAD_SPECIALIST_ENGINEER',
    roles: 'USER',
    isActive: true,
} as const;

test('only the current department chief can edit their employees', () => {
    assert.equal(canManageEmployeeSpeciality(chief, employee), true);
    assert.equal(
        canManageEmployeeSpeciality({ ...chief, speciality: 'DEPUTY_DEPARTMENT_CHIEF' }, employee),
        false,
    );
    assert.equal(canManageEmployeeSpeciality(chief, { ...employee, department: 'PTO' }), false);
    assert.equal(canManageEmployeeSpeciality(chief, { ...employee, id: 'chief' }), false);
    assert.equal(canManageEmployeeSpeciality({ ...chief, isActive: false }, employee), false);
    assert.equal(canManageEmployeeSpeciality(chief, { ...employee, isActive: false }), false);
});

test('a chief can change a deputy but cannot edit another chief or an admin', () => {
    assert.equal(
        canManageEmployeeSpeciality(chief, { ...employee, speciality: 'DEPUTY_DEPARTMENT_CHIEF' }),
        true,
    );
    assert.equal(
        canManageEmployeeSpeciality(chief, { ...employee, speciality: 'DEPARTMENT_CHIEF' }),
        false,
    );
    assert.equal(canManageEmployeeSpeciality(chief, { ...employee, roles: 'ADMIN' }), false);
    assert.equal(
        canManageEmployeeSpeciality(
            { ...chief, department: 'OOEFP', speciality: 'CHIEF_SPECIALIST_AGRONOMIST' },
            { ...employee, department: 'OOEFP' },
        ),
        true,
    );
});

test('new positions must belong to the department and cannot be chief positions', () => {
    assert.equal(canSetEmployeeSpeciality('OSO', 'DEPUTY_DEPARTMENT_CHIEF'), true);
    assert.equal(canSetEmployeeSpeciality('OSO', 'DEPARTMENT_CHIEF'), false);
    assert.equal(canSetEmployeeSpeciality('OSO', 'PLUMBER'), false);
    assert.equal(canSetEmployeeSpeciality('OOEFP', 'CHIEF_SPECIALIST_AGRONOMIST'), false);
    assert.equal(getManageableSpecialties('OSO').includes('DEPUTY_DEPARTMENT_CHIEF'), true);
    assert.equal(getManageableSpecialties('OSO').includes('DEPARTMENT_CHIEF'), false);
});
