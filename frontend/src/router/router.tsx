import { createBrowserRouter } from 'react-router';

import { AuthLayout } from '@/layouts/auth/AuthLayout';
import { MainLayout } from '@/layouts/main/MainLayout';

import { HomePage } from '@/pages/HomePage/HomePage';
import { AuthPage } from '@/pages/AuthPage/AuthPage';

export const router = createBrowserRouter([
    { element: <AuthLayout />, children: [{ path: '/auth', element: <AuthPage /> }] },
    { element: <MainLayout />, children: [{ path: '/', element: <HomePage /> }] },
]);
