import type { Components } from '@mui/material/styles';

export const MuiAccordionTheme: Components = {
    MuiAccordion: {
        styleOverrides: {
            root: {
                backgroundColor: '#424147',
                color: '#ffffff',

                '&.Mui-expanded': {
                    margin: 0,
                },

                '&.MuiAccordion-rounded': {
                    borderRadius: 16,
                },
            },
        },
    },

    MuiAccordionSummary: {
        styleOverrides: {
            root: {
                fontSize: '15px',
                fontWeight: 500,

                '&.Mui-expanded': {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
                },
            },

            expandIconWrapper: {
                color: '#ffffff',
            },
        },
    },

    MuiAccordionDetails: {
        styleOverrides: {
            root: {
                fontSize: '15px',
                padding: '16px',
                lineHeight: 1.5,
            },
        },
    },
};
