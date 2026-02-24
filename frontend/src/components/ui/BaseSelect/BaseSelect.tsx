import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';

// TODO: доработать компонент, тут проблема с пропсами, они по сути захардкожены, а надо сделать через SelectProps

type BaseSelectProps<T extends string | number> = {
    label?: string;
    fullWidth?: boolean;
    value: T;
    menuItems: {
        id: number;
        value: T;
        title: string;
    }[];
    onChange: (value: T) => void;
};

export const BaseSelect = <T extends string | number>({
    label,
    fullWidth,
    value,
    menuItems,
    onChange,
}: BaseSelectProps<T>) => {
    const handleChange = (event: SelectChangeEvent<T>) => {
        onChange(event.target.value as T);
    };

    return (
        <FormControl size="small" fullWidth={fullWidth}>
            <InputLabel
                id="demo-select-small-label"
                sx={{
                    color: '#ffffff7a',
                    fontSize: 14,
                }}
            >
                {label}
            </InputLabel>
            <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={value}
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
                        sx: {
                            padding: 0,
                        },
                    },
                }}
                sx={{
                    color: 'white',
                    fontSize: 14,
                    minWidth: 160,

                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff40',
                    },

                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff4d',
                    },

                    '& .MuiSvgIcon-root': {
                        color: '#ffffff40',
                    },

                    '&:hover .MuiSvgIcon-root': {
                        color: '#ffffff4d',
                    },
                }}
            >
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.id}
                        value={item.value}
                        sx={{
                            fontSize: 14,
                        }}
                    >
                        {item.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
