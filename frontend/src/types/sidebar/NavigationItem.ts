import type { SvgIconComponent } from '@mui/icons-material';

export type NavigationItem = {
    id: number;
    title: string;
    link: string;
    icon: SvgIconComponent;
};
