import { Alert, Slide, Snackbar } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

import { removeNotification } from '@/stores/slices/notificationSlice';

const AUTO_HIDE_DURATION = 5000;

const SlideTransition = (props: TransitionProps & { children: React.ReactElement }) => {
    return <Slide {...props} direction="left" />;
};

export const NotificationCenter = () => {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector((state) => state.notification.items);

    return (
        <>
            {notifications.map((notification, index) => (
                <Snackbar
                    key={notification.id}
                    open
                    autoHideDuration={AUTO_HIDE_DURATION}
                    onClose={(_, reason) => {
                        if (reason === 'clickaway') return;
                        dispatch(removeNotification(notification.id));
                    }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    TransitionComponent={SlideTransition}
                    sx={{ top: `${16 + index * 64}px !important` }}
                >
                    <Alert
                        severity={notification.type}
                        variant="filled"
                        onClose={() => dispatch(removeNotification(notification.id))}
                        sx={{ minWidth: 280 }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
};
