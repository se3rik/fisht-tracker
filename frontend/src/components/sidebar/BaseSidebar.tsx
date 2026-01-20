import styles from './BaseSidebar.module.scss';

import { Avatar } from '@mui/material';
import AdsClickIcon from '@mui/icons-material/AdsClick';

import { stringAvatar } from '@/helpers/stringAvatar';
import { navigationList } from '@/constants/navigationList';
import { NavLink } from 'react-router';

export const BaseSidebar = () => {
    return (
        <aside className={styles.sidebarSection}>
            <section className={styles.heroSection}>
                <div className={styles.logoWrapper}>
                    <AdsClickIcon className={styles.logoIcon} color="primary" fontSize="large" />
                    <span className={styles.logoTitle}>Fisht Tracker</span>
                </div>
            </section>
            <section className={styles.navSection}>
                <ul className={styles.navList}>
                    {navigationList.map((el) => (
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
            </section>
            <NavLink
                to={'/profile'}
                className={({ isActive }) =>
                    isActive ? `${styles.profileLink} ${styles.active}` : styles.profileLink
                }
            >
                <div className={styles.profileAvatar}>
                    <Avatar
                        {...stringAvatar('Sergey Ryndin')}
                        sx={{ width: 32, height: 32, fontSize: 16 }}
                    />
                </div>
                <span className={styles.profileTitle}>Учетная запись</span>
            </NavLink>
        </aside>
    );
};
