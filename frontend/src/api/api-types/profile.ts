export type ProfileDataResponse = {
    id: string;
    email: string;
    firstName: string;
    secondName: string;
    patronymic: string | null;
    department: string | null;
    speciality: string | null;
};

export type UpdateProfileRequest = Partial<Omit<ProfileDataResponse, 'id'>>;
