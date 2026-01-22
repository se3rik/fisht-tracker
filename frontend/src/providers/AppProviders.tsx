import { StoreProvider } from '@/providers/StoreProvider';
import { RouterProvider } from '@/providers/RouterProvider';
import { AppThemeProvider } from '@/providers/AppThemeProvider';

export const AppProviders = () => {
    return (
        <AppThemeProvider>
            <StoreProvider>
                <RouterProvider />
            </StoreProvider>
        </AppThemeProvider>
    );
};
