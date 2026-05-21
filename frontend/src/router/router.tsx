import { createBrowserRouter } from 'react-router';

import { AuthLayout } from '@/layouts/auth/AuthLayout';
import { MainLayout } from '@/layouts/main/MainLayout';
import { TasksLayout } from '@/layouts/tasks/TasksLayout';

import { AuthPage } from '@/pages/AuthPage/AuthPage';
import { HomePage } from '@/pages/HomePage/HomePage';
import { TasksPage } from '@/pages/TasksPage/TasksPage';
import { TaskCreationPage } from '@/pages/TaskCreationPage/TaskCreationPage';
import { TaskDetailsPage } from '@/pages/TaskDetailsPage/TaskDetailsPage';
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage';
import { InProgressPage } from '@/pages/InProgressPage/InProgressPage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';

export const router = createBrowserRouter([
    { element: <AuthLayout />, children: [{ path: '/auth', element: <AuthPage /> }] },
    {
        element: <MainLayout />,
        children: [
            { path: '/', element: <HomePage /> },
            {
                path: '/tasks',
                element: <TasksLayout />,
                children: [
                    { index: true, element: <TasksPage /> },
                    { path: ':id', element: <TaskDetailsPage /> },
                    { path: 'new-task', element: <TaskCreationPage /> },
                ],
            },
            { path: '/boards', element: <InProgressPage /> },
            { path: '/goals', element: <InProgressPage /> },
            { path: '/administration', element: <InProgressPage /> },
            { path: '/employees', element: <InProgressPage /> },
            { path: '/profile', element: <ProfilePage /> },

            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);
