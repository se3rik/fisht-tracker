import type { User } from '../../generated/prisma/client.js';

export class UserDto {
    id: string;
    email: string;
    firstName: string;
    secondName: string;
    roles: 'USER' | 'ADMIN';

    constructor(model: User) {
        this.id = model.id;
        this.email = model.email;
        this.firstName = model.firstName;
        this.secondName = model.secondName;
        this.roles = model.roles;
    }
}
