import type { User } from '../../generated/prisma/client.js';
import type { Department, Specialty } from '../../generated/prisma/client.js';

export class ProfileDto {
    id: string;
    email: string;
    firstName: string;
    secondName: string;
    patronymic: string | null;
    department: Department | null;
    speciality: Specialty | null;

    constructor(model: User) {
        this.id = model.id;
        this.email = model.email;
        this.firstName = model.firstName;
        this.secondName = model.secondName;
        this.patronymic = model.patronymic ?? null;
        this.department = model.department ?? null;
        this.speciality = model.speciality ?? null;
    }
}
