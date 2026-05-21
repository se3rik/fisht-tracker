import { createTheme } from '@mui/material/styles';

import { MuiAccordionTheme } from '@/styles/themes/MuiAccordionTheme';

export const theme = createTheme({
    components: { ...MuiAccordionTheme },
});
