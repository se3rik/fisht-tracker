import type { User } from '../../generated/prisma/client.js';

export class UserDto {
    id;
    email;
    isVerified;

    constructor(model: User) {
        this.id = model.id;
        this.email = model.email;
        this.isVerified = model.isVerified;
    }
}
