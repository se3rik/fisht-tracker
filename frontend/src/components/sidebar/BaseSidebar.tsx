import styles from './BaseSidebar.module.scss';

import { Avatar } from '@mui/material';
import AdsClickIcon from '@mui/icons-material/AdsClick';

import { stringAvatar } from '@/helpers/stringAvatar';
import { navigationList } from '@/constants/navigationList';

export const BaseSidebar = () => {
    return (
        <section className={styles.sidebarSection}>
            <section className={styles.heroSection}>
                <div className={styles.logoWrapper}>
                    <AdsClickIcon className={styles.logoIcon} color="primary" fontSize="large" />
                    <span className={styles.logoTitle}>Fisht Tracker</span>
                </div>
            </section>
            <section className={styles.navSection}>
                <ul className={styles.navList}>
                    {navigationList.map((el) => (
                        <li className={styles.navItem} key={el.id}>
                            <el.icon className={styles.navIcon} fontSize="small" />
                            <span className={styles.navTitle}>{el.title}</span>
                        </li>
                    ))}
                </ul>
            </section>
            <section className={styles.profileSection}>
                <div className={styles.profileAvatar}>
                    <Avatar
                        {...stringAvatar('Sergey Ryndin')}
                        sx={{ width: 32, height: 32, fontSize: 16 }}
                    />
                </div>
                <span className={styles.profileTitle}>Учетная запись</span>
            </section>
        </section>
    );
};
