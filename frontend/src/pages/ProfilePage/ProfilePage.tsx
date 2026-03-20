import { useAppSelector } from '@/hooks/useAppSelector';
import { Avatar } from '@mui/material';

import styles from './ProfilePage.module.scss';

import { PageHeading } from '@/components/PageHeading/PageHeading';

import { stringAvatar } from '@/helpers/stringAvatar';

export const ProfilePage = () => {
    const profileData = useAppSelector((state) => state.profile.profileData);

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
                                <span>{profileData?.lastName}</span>
                            </li>
                            <li className={styles.profileInfoItem}>
                                <span>Имя</span>
                                <span>{profileData?.firstName}</span>
                            </li>
                            <li className={styles.profileInfoItem}>
                                <span>Отчество</span>
                                <span>{profileData?.patronymic}</span>
                            </li>
                            <li className={styles.profileInfoItem}>
                                <span>Почта</span>
                                <span>{profileData?.email}</span>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </>
    );
};
