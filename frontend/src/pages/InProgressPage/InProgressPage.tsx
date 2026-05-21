import styles from './InProgressPage.module.scss';

import CodeIcon from '@mui/icons-material/Code';

export const InProgressPage = () => {
    return (
        <section className={styles.pageWrapper}>
            <CodeIcon className={styles.inProgressIcon} />
            <span className={styles.inProgressTitle}>Страница находится в разработке</span>
        </section>
    );
};
