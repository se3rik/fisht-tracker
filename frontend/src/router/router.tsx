import { createBrowserRouter } from 'react-router';

import { AuthLayout } from '@/layouts/auth/AuthLayout';
import { MainLayout } from '@/layouts/main/MainLayout';

import { HomePage } from '@/pages/HomePage/HomePage';
import { AuthPage } from '@/pages/AuthPage/AuthPage';
import { TasksPage } from '@/pages/TasksPage/TasksPage';
import { InProgressPage } from '@/pages/InProgressPage/InProgressPage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';

export const router = createBrowserRouter([
    { element: <AuthLayout />, children: [{ path: '/auth', element: <AuthPage /> }] },
    {
        element: <MainLayout />,
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/tasks', element: <TasksPage /> },
            { path: '/boards', element: <InProgressPage /> },
            { path: '/goals', element: <InProgressPage /> },
            { path: '/administration', element: <InProgressPage /> },
            { path: '/employees', element: <InProgressPage /> },
            { path: '/profile', element: <InProgressPage /> },

            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);
