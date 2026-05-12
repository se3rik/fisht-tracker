export type UserDto = {
    id: string;
    email: string;
    firstName: string;
    secondName: string;
};

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    user: UserDto;
};

export type RegistrationRequest = {
    email: string;
    firstName: string;
    secondName: string;
    password: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};
