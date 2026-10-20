import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageIntro } from '@/components/pageIntro/PageIntro';
import { notificationsApi, type Notification } from '@/api/notifications.api';
import { NOTIFICATIONS_CHANGED_EVENT } from '@/hooks/useLiveEvents';
import styles from './NotificationsPage.module.scss';

export const NotificationsPage = () => {
    const [items, setItems] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        let loadingRequest = false;
        let pending = false;
        const reload = async () => {
            if (loadingRequest) {
                pending = true;
                return;
            }
            loadingRequest = true;
            try {
                const data = await notificationsApi.list();
                if (!active) return;
                setItems(data.items);
                setError(null);
                if (data.unreadCount) {
                    await notificationsApi.markRead(data.asOf);
                    if (active)
                        setItems((current) =>
                            current.map((item) => ({
                                ...item,
                                readAt: item.readAt ?? data.asOf,
                            })),
                        );
                }
            } catch (err) {
                if (active)
                    setError(
                        err instanceof Error ? err.message : 'Не удалось загрузить уведомления',
                    );
            } finally {
                loadingRequest = false;
                if (active) setLoading(false);
                if (active && pending) {
                    pending = false;
                    void reload();
                }
            }
        };
        void reload();
        window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, reload);
        return () => {
            active = false;
            window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, reload);
        };
    }, []);

    return (
        <div className={styles.page}>
            <PageIntro
                eyebrow="Рабочее пространство"
                title="Уведомления"
                description="События по задачам, в которых вы участвуете."
            />
            {loading && <CircularProgress aria-label="Загрузка уведомлений" />}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && items.length === 0 && (
                <Paper variant="outlined" className={styles.empty}>
                    Пока нет уведомлений.
                </Paper>
            )}
            {!error && items.length > 0 && (
                <div className={styles.list}>
                    {items.map((item) => (
                        <Paper
                            key={item.id}
                            component={Link}
                            to={`/tasks/${item.taskId}`}
                            variant="outlined"
                            className={styles.item}
                        >
                            <Box className={styles.itemContent}>
                                <Typography fontWeight={600}>{item.message}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(item.createdAt).toLocaleString('ru-RU')}
                                </Typography>
                            </Box>
                            <span className={styles.taskLink}>
                                Перейти к задаче <ArrowForwardIcon fontSize="small" />
                            </span>
                        </Paper>
                    ))}
                </div>
            )}
        </div>
    );
};
