import { Outlet, useLocation, useParams } from 'react-router';

import { PageHeading } from '@/components/PageHeading/PageHeading';

export const TasksLayout = () => {
    const { id } = useParams();
    const location = useLocation();

    const title = location.pathname.includes('new-task')
        ? 'Создание задачи'
        : id
          ? `Задача #${id}`
          : 'Задачи';

    return (
        <>
            <PageHeading title={title} />
            <Outlet />
        </>
    );
};
