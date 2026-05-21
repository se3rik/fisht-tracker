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

import type { SignUpForm } from '@/types/auth';

type SignUpFieldsProps = {
    showPassword: boolean;
    form: UseFormReturn<SignUpForm>;
    handleClickShowPassword: () => void;
};

export const SignUpFields = ({
    showPassword,
    form,
    handleClickShowPassword,
}: SignUpFieldsProps) => {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <>
            <FormControl variant="outlined" error={!!errors.email}>
                <InputLabel htmlFor="email">Почта</InputLabel>
                <OutlinedInput
                    id="email"
                    type="text"
                    label="Почта"
                    autoComplete="email"
                    {...register('email')}
                />
                <FormHelperText>{errors.email?.message}</FormHelperText>
            </FormControl>
            <FormControl variant="outlined" error={!!errors.firstName}>
                <InputLabel htmlFor="firstName">Имя</InputLabel>
                <OutlinedInput
                    id="firstName"
                    type="text"
                    label="Имя"
                    autoComplete="firstName"
                    {...register('firstName')}
                />
                <FormHelperText>{errors.firstName?.message}</FormHelperText>
            </FormControl>
            <FormControl variant="outlined" error={!!errors.secondName}>
                <InputLabel htmlFor="secondName">Фамилия</InputLabel>
                <OutlinedInput
                    id="secondName"
                    type="text"
                    label="Фамилия"
                    autoComplete="secondName"
                    {...register('secondName')}
                />
                <FormHelperText>{errors.secondName?.message}</FormHelperText>
            </FormControl>
            <FormControl variant="outlined" error={!!errors.password}>
                <InputLabel htmlFor="password">Пароль</InputLabel>
                <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Пароль"
                    autoComplete="new-password"
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
