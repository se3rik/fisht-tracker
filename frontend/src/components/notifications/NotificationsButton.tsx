import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { Badge, IconButton, Tooltip } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

import { notificationsApi } from '@/api/notifications.api';
import { NOTIFICATIONS_CHANGED_EVENT } from '@/hooks/useLiveEvents';

export const NotificationsButton = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let active = true;
        const reload = () => {
            void notificationsApi
                .unreadCount()
                .then((data) => {
                    if (active) setUnreadCount(data.unreadCount);
                })
                .catch(() => {
                    // Новый запрос выполнится после переподключения.
                });
        };
        reload();
        window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, reload);
        return () => {
            active = false;
            window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, reload);
        };
    }, []);

    return (
        <Tooltip title="Уведомления">
            <IconButton
                component={NavLink}
                to="/notifications"
                aria-label={`Уведомления: ${unreadCount} непрочитанных`}
                sx={{
                    width: 40,
                    height: 40,
                    color: 'text.secondary',
                    border: '1px solid #ffffff24',
                    borderRadius: '12px',
                    '&:hover': { color: 'text.primary', backgroundColor: '#8fb5ff1c' },
                    '&.active': {
                        color: '#9fc1ff',
                        borderColor: '#8fb5ff55',
                        backgroundColor: '#8fb5ff1c',
                    },
                }}
            >
                <Badge badgeContent={unreadCount} color="error" max={99}>
                    <NotificationsOutlinedIcon fontSize="small" />
                </Badge>
            </IconButton>
        </Tooltip>
    );
};
