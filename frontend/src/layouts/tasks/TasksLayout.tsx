import { Outlet, useLocation, useParams } from 'react-router';

import styles from './TasksLayout.module.scss';

import { PageHeading } from '@/components/pageHeading/PageHeading';

export const TasksLayout = () => {
    const { id } = useParams();
    const location = useLocation();

    const title = location.pathname.includes('new-task')
        ? 'Создание задачи'
        : id
          ? `Задача #${id}`
          : 'Задачи';

    return (
        <div className={styles.layoutWrapper}>
            <PageHeading title={title} />
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};
