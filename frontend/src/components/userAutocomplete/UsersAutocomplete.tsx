import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

import { usersApi, type UserSearchResult } from '@/api/users.api';

type SingleProps = {
    multiple?: false;
    value?: UserSearchResult | null;
    onChange: (userId: string) => void;
    onChangeUser?: (user: UserSearchResult | null) => void;
};

type MultiProps = {
    multiple: true;
    value?: UserSearchResult[];
    onChange: (userIds: string[]) => void;
    onChangeUser?: (users: UserSearchResult[]) => void;
};

type UserAutocompleteProps = (SingleProps | MultiProps) & {
    disabled?: boolean;
    error?: boolean;
};

export const UserAutocomplete = (props: UserAutocompleteProps) => {
    const { disabled, error, multiple } = props;

    const [options, setOptions] = useState<UserSearchResult[]>([]);

    const [internalSingle, setInternalSingle] = useState<UserSearchResult | null>(null);
    const [internalMulti, setInternalMulti] = useState<UserSearchResult[]>([]);

    const currentValue = multiple
        ? ((props as MultiProps).value ?? internalMulti)
        : ((props as SingleProps).value ?? internalSingle);

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

    const handleChange = (_: unknown, val: UserSearchResult | UserSearchResult[] | null) => {
        if (multiple) {
            const arr = (val as UserSearchResult[]) ?? [];
            setInternalMulti(arr);
            (props as MultiProps).onChange(arr.map((u) => u.id));
            (props as MultiProps).onChangeUser?.(arr);
        } else {
            const single = val as UserSearchResult | null;
            setInternalSingle(single);
            (props as SingleProps).onChange(single ? single.id : '');
            (props as SingleProps).onChangeUser?.(single);
        }
    };

    return (
        <Autocomplete
            multiple={multiple}
            options={options}
            value={currentValue}
            disabled={disabled}
            getOptionLabel={(option) => `${option.firstName} ${option.secondName}`}
            onInputChange={handleInputChange}
            onChange={handleChange}
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
                        '& .MuiChip-root': {
                            backgroundColor: '#3a3942',
                            color: 'white',
                            width: '100%',
                            textAlign: 'start',
                        },
                    }}
                />
            )}
        />
    );
};
