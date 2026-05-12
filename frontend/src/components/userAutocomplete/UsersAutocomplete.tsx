import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

import { usersApi, type UserSearchResult } from '@/api/users.api';

type UserAutocompleteProps = {
    onChange: (userId: string) => void;
    onChangeUser?: (user: UserSearchResult | null) => void;
    disabled?: boolean;
    value?: UserSearchResult | null;
    error?: boolean;
};

export const UserAutocomplete = ({
    onChange,
    onChangeUser,
    disabled,
    value,
    error,
}: UserAutocompleteProps) => {
    const [options, setOptions] = useState<UserSearchResult[]>([]);
    const [internalValue, setInternalValue] = useState<UserSearchResult | null>(value ?? null);

    const currentValue = value !== undefined ? value : internalValue;

    const handleInputChange = async (_: unknown, inputValue: string) => {
        if (!inputValue) {
            setOptions([]);
            return;
        }

        try {
            const users = await usersApi.searchUsers(inputValue);
            setOptions(users);
        } catch {
            setOptions([]);
        }
    };

    return (
        <Autocomplete
            options={options}
            value={currentValue}
            disabled={disabled}
            getOptionLabel={(option) => `${option.firstName} ${option.secondName}`}
            onInputChange={handleInputChange}
            onChange={(_, val) => {
                setInternalValue(val);
                if (val) {
                    onChange(val.id);
                    onChangeUser?.(val);
                } else {
                    onChange('');
                    onChangeUser?.(null as any);
                }
            }}
            isOptionEqualToValue={(option, val) => option.id === val.id}
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
                    placeholder={disabled ? '' : 'Введите текст для поиска'}
                    variant="outlined"
                    autoComplete="off"
                    error={error}
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
                        '& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline':
                            {
                                borderColor: 'transparent',
                            },
                        '& .MuiOutlinedInput-root.Mui-disabled': {
                            backgroundColor: '#ffffff08',
                            borderRadius: '4px',
                            cursor: 'not-allowed',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'transparent',
                            },
                            '& input': {
                                WebkitTextFillColor: '#ffffffcf',
                                cursor: 'not-allowed',
                            },
                        },
                        '& .MuiAutocomplete-endAdornment .MuiIconButton-root.Mui-disabled': {
                            color: '#ffffff20',
                        },
                    }}
                />
            )}
        />
    );
};
