import { Link } from 'react-router';

import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
    return (
        <section className={styles.pageWrapper}>
            <h1 className={styles.title}>Ошибка 404</h1>
            <p className={styles.text}>Страница не найдена</p>

            <Link to="/" className={styles.fallbackLink}>
                Вернуться на главную
            </Link>
        </section>
    );
};
