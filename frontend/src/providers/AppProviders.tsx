import { StoreProvider } from '@/providers/StoreProvider';
import { RouterProvider } from '@/providers/RouterProvider';
import { AppThemeProvider } from '@/providers/AppThemeProvider';

import { NotificationCenter } from '@/components/notificationCenter/NotificationCenter';

export const AppProviders = () => {
    return (
        <AppThemeProvider>
            <StoreProvider>
                <RouterProvider />
                <NotificationCenter />
            </StoreProvider>
        </AppThemeProvider>
    );
};
