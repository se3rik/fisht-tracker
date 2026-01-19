import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import AutoAwesomeMotionRoundedIcon from '@mui/icons-material/AutoAwesomeMotionRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

import type { NavigationItem } from '@/types/sidebar/NavigationItem';

export const navigationList: NavigationItem[] = [
    {
        id: 1,
        title: 'Задачи',
        icon: AssignmentRoundedIcon,
    },
    {
        id: 2,
        title: 'Доски',
        icon: AutoAwesomeMotionRoundedIcon,
    },
    {
        id: 3,
        title: 'Цели',
        icon: AssignmentTurnedInRoundedIcon,
    },
    {
        id: 4,
        title: 'Администрирование',
        icon: BuildRoundedIcon,
    },
    {
        id: 5,
        title: 'Добавить пользователя',
        icon: PersonAddAltRoundedIcon,
    },
];
