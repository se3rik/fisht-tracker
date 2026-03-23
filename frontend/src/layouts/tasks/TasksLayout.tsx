import { Outlet, useLocation, useParams } from 'react-router';

import { PageHeading } from '@/components/pageHeading/PageHeading';

export const TasksLayout = () => {
    const { taskId } = useParams();
    const location = useLocation();

    const title = location.pathname.includes('new-task')
        ? 'Создание задачи'
        : taskId
          ? `Задача #${taskId}`
          : 'Задачи';

    return (
        <>
            <PageHeading title={title} />
            <Outlet />
        </>
    );
};
