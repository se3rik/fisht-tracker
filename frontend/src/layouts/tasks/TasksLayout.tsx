import { Outlet, useParams } from 'react-router';

import { PageHeading } from '@/components/ui/PageHeading/PageHeading';

export const TasksLayout = () => {
    const { taskId } = useParams();

    const title = taskId ? `Задача #${taskId}` : 'Задачи';

    return (
        <>
            <PageHeading title={title} />
            <Outlet />
        </>
    );
};
