import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import type { TabItem } from '@/types/tabs/TabItem';

type BaseTabsProps<T extends string = string> = {
    value: T;
    onChange: (value: T) => void;
    items: TabItem<T>[];
    className?: string;
};

export const BaseTabs = <T extends string = string>({
    value,
    onChange,
    items,
    className,
}: BaseTabsProps<T>) => {
    return (
        <Tabs value={value} onChange={(_, newValue: T) => onChange(newValue)} className={className}>
            {items.map((item) => (
                <Tab
                    key={item.value}
                    value={item.value}
                    label={item.label}
                    disabled={item.disabled}
                    sx={{ color: 'white' }}
                />
            ))}
        </Tabs>
    );
};
