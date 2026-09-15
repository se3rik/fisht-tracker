import type { TabItem } from '@/types/tabs/TabItem';
import type { TabValue } from '@/types/tabs/TabValue';

export const TABS: TabItem<TabValue>[] = [
    { value: 'users', label: 'Пользователи' },
    { value: 'departments', label: 'Отделы' },
    { value: 'roles', label: 'Роли и доступы' },
    { value: 'log', label: 'Журнал действий' },
];
