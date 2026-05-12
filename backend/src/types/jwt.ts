export type JWTPayload = {
    id: string;
    email: string;
    roles: 'USER' | 'ADMIN';
};
