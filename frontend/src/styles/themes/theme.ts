import { createTheme } from '@mui/material/styles';

import { MuiAccordionTheme } from '@/styles/themes/MuiAccordionTheme';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#8fb5ff' },
        background: { default: '#202126', paper: '#292d37' },
        text: { primary: '#f5f5f7', secondary: '#c2c5ce' },
        divider: '#ffffff26',
    },
    shape: { borderRadius: 12 },
    components: {
        ...MuiAccordionTheme,
        MuiButton: {
            styleOverrides: { root: { borderRadius: 10, textTransform: 'none', fontWeight: 600 } },
        },
        MuiPaper: { styleOverrides: { outlined: { borderColor: '#ffffff19' } } },
        MuiDialog: { styleOverrides: { paper: { backgroundImage: 'none' } } },
    },
});
