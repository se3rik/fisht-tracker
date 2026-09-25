import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import styles from './ProfilePage.module.scss';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

import { getProfileData, updateProfileData } from '@/stores/slices/profileSlice';

import { profileApi } from '@/api';

import { PageHeading } from '@/components/pageHeading/PageHeading';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';

import { stringAvatar } from '@/helpers/stringAvatar';

import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';
import { SPECIALTY_LABELS } from '@/constants/specialityLabels';
import { DEPARTMENT_SPECIALTY_MAP } from '@/constants/departmentSpecialityMap';

import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

const departmentItems = Object.entries(DEPARTMENT_LABELS).map(([value, title], id) => ({
    id,
    value,
    title,
}));

type ProfileFormValues = {
    secondName: string;
    firstName: string;
    patronymic: string;
    email: string;
    department: TaskDepartmentValues | '';
    speciality: string;
};

type PasswordFormState = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const emptyPasswordForm: PasswordFormState = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
};

export const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { profileData } = useAppSelector((state) => state.profile);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { register, reset, handleSubmit, control, watch } = useForm<ProfileFormValues>({
        defaultValues: {
            secondName: '',
            firstName: '',
            patronymic: '',
            email: '',
            department: '',
            speciality: '',
        },
    });
    const selectedDepartment = watch('department');

    // ==== смена пароля ====
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState<PasswordFormState>(emptyPasswordForm);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    const filteredSpecialtyItems =
        selectedDepartment && DEPARTMENT_SPECIALTY_MAP[selectedDepartment]
            ? DEPARTMENT_SPECIALTY_MAP[selectedDepartment].map((value, index) => ({
                  id: index,
                  value,
                  title: SPECIALTY_LABELS[value],
              }))
            : Object.entries(SPECIALTY_LABELS).map(([value, title], index) => ({
                  id: index,
                  value,
                  title,
              }));

    useEffect(() => {
        dispatch(getProfileData());
    }, [dispatch]);

    useEffect(() => {
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
    }, [profileData, reset]);

    const onSubmit = handleSubmit((data) => {
        dispatch(
            updateProfileData({
                ...data,
                department: data.department || null,
                speciality: data.speciality || null,
            }),
        );

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

    // ==== смена пароля: хендлеры ====

    const openPasswordDialog = () => {
        setPasswordForm(emptyPasswordForm);
        setPasswordError(null);
        setPasswordSuccess(null);
        setShowOldPassword(false);
        setShowNewPassword(false);
        setIsPasswordOpen(true);
    };

    const closePasswordDialog = () => setIsPasswordOpen(false);

    const handlePasswordExited = () => {
        setPasswordForm(emptyPasswordForm);
        setPasswordError(null);
        setPasswordSuccess(null);
    };

    const handlePasswordFieldChange = (field: keyof PasswordFormState, value: string) => {
        setPasswordForm((prev) => ({ ...prev, [field]: value }));
    };

    const isPasswordFormValid =
        passwordForm.oldPassword.trim().length > 0 &&
        passwordForm.newPassword.trim().length >= 3 &&
        passwordForm.newPassword === passwordForm.confirmPassword;

    const passwordMismatch =
        passwordForm.confirmPassword.length > 0 &&
        passwordForm.newPassword !== passwordForm.confirmPassword;

    const handleSubmitPasswordChange = async () => {
        if (!isPasswordFormValid) return;

        setIsPasswordSubmitting(true);
        setPasswordError(null);
        setPasswordSuccess(null);

        try {
            await profileApi.changePassword({
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword,
            });

            setPasswordSuccess('Пароль успешно изменён');
            setPasswordForm(emptyPasswordForm);
        } catch (error) {
            setPasswordError((error as Error).message);
        } finally {
            setIsPasswordSubmitting(false);
        }
    };

    return (
        <>
            <PageHeading title="Страница профиля" />
            <div className={styles.pageWrapper}>
                <section className={styles.profileInfoWrapper}>
                    <Avatar
                        className={styles.avatarComponent}
                        {...stringAvatar(`${profileData?.firstName} ${profileData?.secondName}`)}
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
                                        menuItems={filteredSpecialtyItems}
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
                            <>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={openPasswordDialog}
                                >
                                    Сменить пароль
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Редактировать
                                </Button>
                            </>
                        )}
                    </div>
                </section>
            </div>

            {/* ==== диалог: смена пароля ==== */}
            <Dialog
                open={isPasswordOpen}
                onClose={closePasswordDialog}
                fullWidth
                maxWidth="xs"
                slotProps={{ transition: { onExited: handlePasswordExited } }}
            >
                <DialogTitle>Сменить пароль</DialogTitle>
                <DialogContent className={styles.passwordDialogContent}>
                    <TextField
                        label="Текущий пароль"
                        type={showOldPassword ? 'text' : 'password'}
                        value={passwordForm.oldPassword}
                        onChange={(e) => handlePasswordFieldChange('oldPassword', e.target.value)}
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowOldPassword((prev) => !prev)}
                                        >
                                            {showOldPassword ? (
                                                <VisibilityOffIcon fontSize="small" />
                                            ) : (
                                                <VisibilityIcon fontSize="small" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        label="Новый пароль"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordFieldChange('newPassword', e.target.value)}
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                        >
                                            {showNewPassword ? (
                                                <VisibilityOffIcon fontSize="small" />
                                            ) : (
                                                <VisibilityIcon fontSize="small" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        label="Повторите новый пароль"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                            handlePasswordFieldChange('confirmPassword', e.target.value)
                        }
                        error={passwordMismatch}
                        helperText={passwordMismatch ? 'Пароли не совпадают' : ' '}
                        fullWidth
                    />

                    {passwordError && (
                        <Typography variant="body2" color="error">
                            {passwordError}
                        </Typography>
                    )}

                    {passwordSuccess && (
                        <Typography variant="body2" color="success.main">
                            {passwordSuccess}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePasswordDialog} disabled={isPasswordSubmitting}>
                        Закрыть
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!isPasswordFormValid || isPasswordSubmitting}
                        onClick={handleSubmitPasswordChange}
                    >
                        {isPasswordSubmitting ? 'Сохранение...' : 'Сохранить пароль'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
