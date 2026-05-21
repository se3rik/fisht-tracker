import { TextField, type TextFieldProps } from '@mui/material';

type BaseInputProps = TextFieldProps;

export const BaseInput = (props: BaseInputProps) => {
    return (
        <TextField
            {...props}
            variant="outlined"
            autoComplete="off"
            slotProps={{
                inputLabel: { shrink: true },
                ...props.slotProps,
            }}
            sx={{
                '& .MuiInputLabel-root': {
                    color: '#ffffff80',
                    fontSize: 14,
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1976d2',
                },
                '& .MuiInputLabel-root.Mui-disabled': {
                    color: '#ffffffcf',
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
                    '&.Mui-disabled': {
                        backgroundColor: '#ffffff08',
                        borderRadius: '4px',
                        cursor: 'not-allowed',
                    },
                    '&.Mui-disabled .MuiOutlinedInput-input': {
                        WebkitTextFillColor: '#ffffffcf',
                        cursor: 'not-allowed',
                    },
                    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                    },
                    '&:hover:not(.Mui-focused).Mui-disabled .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                    },
                },
                ...props.sx,
            }}
        />
    );
};
