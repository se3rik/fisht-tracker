import { FormControl, OutlinedInput, type OutlinedInputProps } from '@mui/material';

type BaseInputProps = OutlinedInputProps;

export const BaseInput = (props: BaseInputProps) => {
    return (
        <FormControl variant="outlined">
            <OutlinedInput
                id={props.id}
                type={props.type}
                size={props.size}
                placeholder={props.placeholder}
                sx={{
                    color: 'white',
                    fontSize: 14,
                    minWidth: 250,

                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff40',
                    },

                    '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff4d',
                    },
                }}
            />
        </FormControl>
    );
};
