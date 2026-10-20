import { NavLink } from 'react-router';

import styles from './BaseSidebar.module.scss';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

import { logout } from '@/stores/slices/authSlice';

import { Avatar } from '@mui/material';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import LogoutIcon from '@mui/icons-material/Logout';
import { NotificationsButton } from '@/components/notifications/NotificationsButton';

import { stringAvatar } from '@/helpers/stringAvatar';
import { navigationList } from '@/constants/navigationList';

export const BaseSidebar = () => {
    const dispatch = useAppDispatch();
    const { profileData } = useAppSelector((state) => state.profile);
    const isAdmin = profileData?.roles === 'ADMIN';

    const visibleNavigationList = navigationList.filter((item) => !item.adminOnly || isAdmin);

    const onLogoutClick = async () => {
        await dispatch(logout());
    };

    return (
        <aside className={styles.sidebarSection}>
            <div className={styles.heroSection}>
                <div className={styles.logoWrapper}>
                    <span className={styles.logoMark}>
                        <AdsClickIcon fontSize="small" />
                    </span>
                    <span className={styles.logoTitle}>Fisht Tracker</span>
                </div>
            </div>
            <nav className={styles.navSection} aria-label="Основная навигация">
                <span className={styles.navCaption}>Разделы</span>
                <ul className={styles.navList}>
                    {visibleNavigationList.map((el) => (
                        <li key={el.id}>
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                }
                                to={el.link}
                            >
                                <el.icon className={styles.navIcon} fontSize="small" />
                                <span className={styles.navTitle}>{el.title}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={styles.accountSection}>
                <div className={styles.accountRow}>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            isActive ? `${styles.profileLink} ${styles.active}` : styles.profileLink
                        }
                    >
                        <Avatar
                            {...stringAvatar(
                                `${profileData?.firstName ?? ''} ${profileData?.secondName ?? ''}`,
                            )}
                            sx={{ width: 36, height: 36, fontSize: 14 }}
                        />
                        <span className={styles.profileText}>
                            <strong>
                                {[profileData?.firstName, profileData?.secondName]
                                    .filter(Boolean)
                                    .join(' ') || 'Мой профиль'}
                            </strong>
                            <span>Учетная запись</span>
                        </span>
                    </NavLink>
                    <NotificationsButton />
                </div>
                <button
                    type="button"
                    className={styles.logoutButton}
                    onClick={onLogoutClick}
                    aria-label="Выйти из аккаунта"
                >
                    <LogoutIcon fontSize="small" />
                    <span>Выйти из аккаунта</span>
                </button>
            </div>
        </aside>
    );
};
