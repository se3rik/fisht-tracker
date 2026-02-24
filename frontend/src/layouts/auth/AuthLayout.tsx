import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';

import type { RootState } from '@/stores/store';

export const AuthLayout = () => {
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

    if (isAuth) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
