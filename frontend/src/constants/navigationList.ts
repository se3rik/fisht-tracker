import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import AutoAwesomeMotionRoundedIcon from '@mui/icons-material/AutoAwesomeMotionRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';

import type { NavigationItem } from '@/types/sidebar/NavigationItem';

export const navigationList: NavigationItem[] = [
    {
        id: 1,
        title: 'Главная',
        link: '/',
        icon: HomeIcon,
    },
    {
        id: 2,
        title: 'Задачи',
        link: '/tasks',
        icon: AssignmentRoundedIcon,
    },
    {
        id: 3,
        title: 'Доски',
        link: '/boards',
        icon: AutoAwesomeMotionRoundedIcon,
    },
    {
        id: 4,
        title: 'Цели',
        link: '/goals',
        icon: AssignmentTurnedInRoundedIcon,
    },
    {
        id: 5,
        title: 'Администрирование',
        link: '/administration',
        icon: BuildRoundedIcon,
    },
    {
        id: 6,
        link: '/employees',
        title: 'Сотрудники',
        icon: PersonIcon,
    },
];
