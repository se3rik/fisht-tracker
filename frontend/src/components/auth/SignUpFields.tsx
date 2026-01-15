import {
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type SignUpFieldsProps = {
    showPassword: boolean;
    handleClickShowPassword: () => void;
};

export const SignUpFields = ({ showPassword, handleClickShowPassword }: SignUpFieldsProps) => {
    return (
        <>
            <FormControl variant="outlined">
                <InputLabel htmlFor="email">Почта</InputLabel>
                <OutlinedInput id="email" type="text" label="Почта" autoComplete="email" />
            </FormControl>
            <FormControl variant="outlined">
                <InputLabel htmlFor="firstName">Имя</InputLabel>
                <OutlinedInput id="firstName" type="text" label="Имя" autoComplete="firstName" />
            </FormControl>
            <FormControl variant="outlined">
                <InputLabel htmlFor="secondName">Фамилия</InputLabel>
                <OutlinedInput
                    id="secondName"
                    type="text"
                    label="Фамилия"
                    autoComplete="secondName"
                />
            </FormControl>
            <FormControl variant="outlined">
                <InputLabel htmlFor="password">Пароль</InputLabel>
                <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Пароль"
                    autoComplete="new-password"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={
                                    showPassword ? 'hide the password' : 'display the password'
                                }
                                onClick={handleClickShowPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <Button size="large" variant="contained">
                Зарегистрироваться
            </Button>
        </>
    );
};
