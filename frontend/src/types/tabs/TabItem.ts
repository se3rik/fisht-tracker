export type TabItem<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
};
