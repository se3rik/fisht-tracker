import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

import { refresh } from '@/stores/slices/authSlice';

import { BaseSidebar } from '@/components/sidebar/BaseSidebar';

import styles from './MainLayout.module.scss';

export const MainLayout = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isInitialized) {
            dispatch(refresh());
        }
    }, [dispatch, isInitialized]);

    if (!isInitialized) return <div>Загрузка...</div>;

    if (!isAuthenticated) return <Navigate to="/auth" replace />;

    return (
        <div className={styles.appWrapper}>
            <BaseSidebar />
            <main className={styles.mainSection}>
                <Outlet />
            </main>
        </div>
    );
};
