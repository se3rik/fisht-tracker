import styles from './PageHeading.module.scss';

type PageHeadingProps = {
    title: string;
};

export const PageHeading = ({ title }: PageHeadingProps) => {
    return (
        <section className={styles.headingWrapper}>
            <span className={styles.headingTitle}>{title}</span>
        </section>
    );
};
