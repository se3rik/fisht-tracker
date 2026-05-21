import { Outlet } from 'react-router';

import { BaseSidebar } from '@/components/sidebar/BaseSidebar';

import styles from '@/App.module.scss';

export const App = () => {
    return (
        <div className={styles.appWrapper}>
            <BaseSidebar />
            <main className={styles.mainSection}>
                <Outlet />
            </main>
        </div>
    );
};
