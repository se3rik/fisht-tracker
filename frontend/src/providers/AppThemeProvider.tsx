import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/styles/themes/theme';

type AppThemeProviderProps = {
    children: React.ReactNode;
};

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
