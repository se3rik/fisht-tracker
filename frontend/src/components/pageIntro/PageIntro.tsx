import type { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';

type PageIntroProps = {
    eyebrow: string;
    title: string;
    description: string;
    action?: ReactNode;
};

export const PageIntro = ({ eyebrow, title, description, action }: PageIntroProps) => (
    <Paper
        component="header"
        variant="outlined"
        sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 3,
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: '20px',
            background: 'linear-gradient(115deg, #242b3e, #202126 70%)',
        }}
    >
        <Box>
            <Typography
                variant="overline"
                sx={{ color: '#8fb5ff', fontWeight: 700, letterSpacing: '.09em' }}
            >
                {eyebrow}
            </Typography>
            <Typography
                component="h1"
                variant="h4"
                sx={{ mt: 0.5, mb: 1, fontWeight: 700, fontSize: 'clamp(22px, 3vw, 30px)' }}
            >
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#c2c5ce', lineHeight: 1.5 }}>
                {description}
            </Typography>
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Paper>
);
