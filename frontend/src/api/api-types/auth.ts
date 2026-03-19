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
