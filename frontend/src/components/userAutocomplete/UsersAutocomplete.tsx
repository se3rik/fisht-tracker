import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

import { usersApi, type UserSearchResult } from '@/api/users.api';

type UserAutocompleteProps = {
    onChange: (userId: string) => void;
};

export const UserAutocomplete = ({ onChange }: UserAutocompleteProps) => {
    const [options, setOptions] = useState<UserSearchResult[]>([]);

    const handleInputChange = async (_: unknown, value: string) => {
        if (!value) {
            setOptions([]);
            return;
        }

        try {
            const users = await usersApi.searchUsers(value);
            setOptions(users);
        } catch {
            setOptions([]);
        }
    };

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => `${option.firstName} ${option.secondName}`}
            onInputChange={handleInputChange}
            onChange={(_, value) => {
                if (value) onChange(value.id);
            }}
            noOptionsText="Пользователи не найдены"
            slotProps={{
                popper: {
                    sx: {
                        '& .MuiAutocomplete-paper': {
                            transition: 'opacity 0.2s ease, transform 0.2s ease',
                        },
                    },
                },
                paper: {
                    sx: {
                        backgroundColor: '#424147',
                        color: 'white',
                        fontSize: 14,
                        border: '1px solid #4d4c52',
                        borderRadius: 2,
                        mt: 0.5,
                        '& .MuiAutocomplete-listbox': {
                            padding: 0,
                        },
                        '& .MuiAutocomplete-noOptions': {
                            color: 'white',
                            fontSize: 14,
                            padding: '6px 16px',
                        },
                        '& .MuiAutocomplete-option': {
                            fontSize: 14,
                            '&:hover': {
                                backgroundColor: '#3a3942',
                            },
                            '&.Mui-focused': {
                                backgroundColor: '#3a3942',
                            },
                        },
                    },
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    size="small"
                    placeholder="Введите текст для поиска"
                    variant="outlined"
                    autoComplete="off"
                    slotProps={{
                        inputLabel: { shrink: true },
                    }}
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: '#ffffff80',
                            fontSize: 14,
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#1976d2',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'white',
                            fontSize: 14,
                            minWidth: 250,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ffffff40',
                            },
                            '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ffffff4d',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1976d2',
                            },
                        },
                        '& .MuiAutocomplete-endAdornment .MuiIconButton-root': {
                            color: '#ffffff80',
                        },
                    }}
                />
            )}
        />
    );
};
