import { Outlet } from 'react-router';

import styles from './TasksLayout.module.scss';

export const TasksLayout = () => {
    return (
        <div className={styles.layoutWrapper}>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};
