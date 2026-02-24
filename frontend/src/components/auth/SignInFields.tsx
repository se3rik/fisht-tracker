import type { UseFormReturn } from 'react-hook-form';

import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import type { SignInForm } from '@/types/auth';

type SignInFieldsProps = {
    showPassword: boolean;
    form: UseFormReturn<SignInForm>;
    handleClickShowPassword: () => void;
};

export const SignInFields = ({
    showPassword,
    form,
    handleClickShowPassword,
}: SignInFieldsProps) => {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <>
            <FormControl variant="outlined" error={!!errors.login}>
                <InputLabel htmlFor="login">Логин</InputLabel>
                <OutlinedInput
                    id="login"
                    type="text"
                    label="Логин"
                    autoComplete="user"
                    {...register('login')}
                />
                <FormHelperText>{errors.login?.message}</FormHelperText>
            </FormControl>
            <FormControl variant="outlined" error={!!errors.password}>
                <InputLabel htmlFor="password">Пароль</InputLabel>
                <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Пароль"
                    autoComplete="current-password"
                    {...register('password')}
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
                <FormHelperText>{errors.password?.message}</FormHelperText>
            </FormControl>
        </>
    );
};
