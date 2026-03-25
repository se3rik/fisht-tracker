import { useEffect } from 'react';
import { Avatar } from '@mui/material';

import styles from './ProfilePage.module.scss';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

import { getProfileData } from '@/stores/slices/profileSlice';

import { PageHeading } from '@/components/pageHeading/PageHeading';

import { stringAvatar } from '@/helpers/stringAvatar';

import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';
import { SPECIALTY_LABELS } from '@/constants/specialityLabels';

export const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { profileData } = useAppSelector((state) => state.profile);

    useEffect(() => {
        dispatch(getProfileData());
    }, [dispatch]);

    return (
        <>
            <PageHeading title="Страница профиля" />
            <div className={styles.pageWrapper}>
                <section className={styles.profileInfoWrapper}>
                    <Avatar
                        {...stringAvatar('Sergey Ryndin')}
                        sx={{ width: 64, height: 64, fontSize: 24 }}
                    />
                    <div className={styles.profileInfoBlock}>
                        <ul className={styles.profileInfoList}>
                            <li className={styles.profileInfoItem}>
                                <span>Фамилия</span>
                                <span>{profileData?.secondName ?? 'Не указано'}</span>
                            </li>
                            <li className={styles.profileInfoItem}>
                                <span>Имя</span>
                                <span>{profileData?.firstName ?? 'Не указано'}</span>
                            </li>
                            <li className={styles.profileInfoItem}>
                                <span>Отчество</span>
                                <span>{profileData?.patronymic ?? 'Не указано'}</span>
                            </li>
                            <li className={styles.profileInfoItem}>
                                <span>Почта</span>
                                <span>{profileData?.email ?? 'Не указано'}</span>
                            </li>
                            <li className={styles.profileInfoItem}>
                                <span>Отдел</span>
                                <span>
                                    {profileData?.department
                                        ? DEPARTMENT_LABELS[profileData.department]
                                        : 'Не указано'}
                                </span>
                            </li>
                            <li className={styles.profileInfoItem}>
                                <span>Специальность</span>
                                <span>
                                    {profileData?.speciality
                                        ? SPECIALTY_LABELS[profileData.speciality]
                                        : 'Не указано'}
                                </span>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </>
    );
};
