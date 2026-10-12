import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import type { RootState } from '@/stores/store';

const authTheme = createTheme();

export const AuthLayout = () => {
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

    if (isAuth) {
        return <Navigate to="/" replace />;
    }

    return (
        <ThemeProvider theme={authTheme}>
            <Outlet />
        </ThemeProvider>
    );
};
