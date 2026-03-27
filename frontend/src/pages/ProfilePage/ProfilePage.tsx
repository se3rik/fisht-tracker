import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Avatar, Button } from '@mui/material';

import styles from './ProfilePage.module.scss';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

import { getProfileData, updateProfileData } from '@/stores/slices/profileSlice';

import { PageHeading } from '@/components/pageHeading/PageHeading';

import { stringAvatar } from '@/helpers/stringAvatar';

import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';
import { SPECIALTY_LABELS } from '@/constants/specialityLabels';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';

const departmentItems = Object.entries(DEPARTMENT_LABELS).map(([value, title], id) => ({
    id,
    value,
    title,
}));
const specialityItems = Object.entries(SPECIALTY_LABELS).map(([value, title], id) => ({
    id,
    value,
    title,
}));

export const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { profileData } = useAppSelector((state) => state.profile);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { register, reset, handleSubmit, control } = useForm({
        defaultValues: {
            secondName: '',
            firstName: '',
            patronymic: '',
            email: '',
            department: '',
            speciality: '',
        },
    });

    useEffect(() => {
        dispatch(getProfileData());
    }, [dispatch]);

    useEffect(() => {
        if (profileData) {
            reset({
                secondName: profileData.secondName ?? 'Не указано',
                firstName: profileData.firstName ?? 'Не указано',
                patronymic: profileData.patronymic ?? 'Не указано',
                email: profileData.email ?? 'Не указано',
                department: profileData.department ?? 'Не указано',
                speciality: profileData.speciality ?? 'Не указано',
            });
        }
    }, [profileData, reset]);

    const onSubmit = handleSubmit((data) => {
        dispatch(updateProfileData(data));
        setIsEditing(false);
    });

    const handleCancelEditing = () => {
        if (profileData) {
            reset({
                secondName: profileData.secondName ?? '',
                firstName: profileData.firstName ?? '',
                patronymic: profileData.patronymic ?? '',
                email: profileData.email ?? '',
                department: profileData.department ?? '',
                speciality: profileData.speciality ?? '',
            });
        }
        setIsEditing(false);
    };

    return (
        <>
            <PageHeading title="Страница профиля" />
            <div className={styles.pageWrapper}>
                <section className={styles.profileInfoWrapper}>
                    <Avatar
                        className={styles.avatarComponent}
                        {...stringAvatar('Sergey Ryndin')}
                        sx={{ width: 64, height: 64, fontSize: 24 }}
                    />
                    <div className={styles.profileInfoBlock}>
                        <form className={styles.profileInfoForm} onSubmit={onSubmit}>
                            <BaseInput
                                id="secondName"
                                disabled={!isEditing}
                                placeholder="Не указано"
                                size="small"
                                label="Фамилия"
                                {...register('secondName')}
                            />
                            <BaseInput
                                id="firstName"
                                disabled={!isEditing}
                                size="small"
                                placeholder="Не указано"
                                label="Имя"
                                {...register('firstName')}
                            />
                            <BaseInput
                                id="patronymic"
                                disabled={!isEditing}
                                size="small"
                                placeholder="Не указано"
                                label="Отчество"
                                {...register('patronymic')}
                            />
                            <BaseInput
                                id="email"
                                disabled={!isEditing}
                                size="small"
                                placeholder="Не указано"
                                label="Почта"
                                {...register('email')}
                            />
                            <Controller
                                name="department"
                                control={control}
                                render={({ field }) => (
                                    <BaseSelect
                                        {...field}
                                        id="department"
                                        label="Отдел"
                                        disabled={!isEditing}
                                        menuItems={departmentItems}
                                    />
                                )}
                            />
                            <Controller
                                name="speciality"
                                control={control}
                                render={({ field }) => (
                                    <BaseSelect
                                        {...field}
                                        id="speciality"
                                        label="Должность"
                                        disabled={!isEditing}
                                        menuItems={specialityItems}
                                    />
                                )}
                            />
                        </form>
                    </div>
                    <div className={styles.buttonBlock}>
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCancelEditing}
                                >
                                    Отменить
                                </Button>
                                <Button variant="contained" size="small" onClick={onSubmit}>
                                    Сохранить
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => setIsEditing(true)}
                            >
                                Редактировать
                            </Button>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};
