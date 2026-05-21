import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectProps,
    type SelectChangeEvent,
} from '@mui/material';

type MenuItemType<T extends string | number> = {
    id: number;
    value: T;
    title: string;
};

type BaseSelectProps<T extends string | number> = Omit<SelectProps<T>, 'onChange'> & {
    label?: string;
    menuItems: MenuItemType<T>[];
    onChange?: ((value: T) => void) | SelectProps<T>['onChange'];
};

export const BaseSelect = <T extends string | number>({
    label,
    menuItems,
    onChange,
    ...rest
}: BaseSelectProps<T>) => {
    const labelId = `${rest.id ?? rest.name ?? label}-label`;

    const handleChange = (event: SelectChangeEvent<T>, child: React.ReactNode) => {
        if (!onChange) return;

        if (onChange.length <= 1) {
            (onChange as (value: T) => void)(event.target.value as T);
        } else {
            (onChange as SelectProps<T>['onChange'])!(event, child);
        }
    };

    return (
        <FormControl size="small" fullWidth={rest.fullWidth}>
            {label && (
                <InputLabel
                    id={labelId}
                    sx={{
                        color: '#ffffff80',
                        fontSize: 14,

                        '&.Mui-focused': {
                            color: '#1976d2',
                        },
                        '&.Mui-disabled': {
                            color: '#ffffffcf',
                        },
                    }}
                >
                    {label}
                </InputLabel>
            )}
            <Select
                {...rest}
                labelId={labelId}
                label={label}
                onChange={handleChange}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            bgcolor: '#424147',
                            color: 'white',
                            border: '1px solid #4d4c52',
                            borderRadius: 2,
                        },
                    },
                    MenuListProps: {
                        sx: { padding: 0 },
                    },
                }}
                sx={{
                    color: 'white',
                    fontSize: 14,
                    minWidth: 160,

                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff40',
                    },
                    '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff4d',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                    },
                    '& .MuiSvgIcon-root': {
                        color: '#ffffff40',
                    },
                    '&:hover .MuiSvgIcon-root': {
                        color: '#ffffff4d',
                    },
                    '&.Mui-disabled': {
                        backgroundColor: '#ffffff08',
                        borderRadius: '4px',
                        cursor: 'not-allowed',
                    },
                    '&.Mui-disabled .MuiSelect-select': {
                        WebkitTextFillColor: '#ffffffcf',
                        cursor: 'not-allowed',
                    },
                    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                    },
                    '&:hover:not(.Mui-focused).Mui-disabled .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                    },
                    '&.Mui-disabled .MuiSvgIcon-root': {
                        color: '#ffffff20',
                    },
                    ...rest.sx,
                }}
            >
                {menuItems.map((item) => (
                    <MenuItem key={item.id} value={item.value} sx={{ fontSize: 14 }}>
                        {item.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
