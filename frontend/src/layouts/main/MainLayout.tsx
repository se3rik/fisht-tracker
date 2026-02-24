import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

import { BaseSidebar } from '@/components/sidebar/BaseSidebar';

import styles from './MainLayout.module.scss';

import type { RootState } from '@/stores/store';

export const MainLayout = () => {
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

    if (!isAuth) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className={styles.appWrapper}>
            <BaseSidebar />
            <main className={styles.mainSection}>
                <Outlet />
            </main>
        </div>
    );
};
