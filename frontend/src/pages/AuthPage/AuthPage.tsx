import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '@/hooks/useAppDispatch';

import { login, registration } from '@/stores/slices/authSlice';

import styles from './AuthPage.module.scss';

import Button from '@mui/material/Button';
import { AuthTabs, SignUpFields, SignInFields } from '@/components/auth';

import FishtLogo from '@/assets/icons/FishtLogo.svg';

import type { AuthTab, SignInForm, SignUpForm } from '@/types/auth';
import { signInFormDefaults, signUpFormDefaults } from '@/constants/authDefaultsForms';
import { signInValidationSchema, signUpValidationSchema } from '@/validation/authValidation';

export const AuthPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [activeTab, setActiveTab] = useState<AuthTab>('signIn');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const signInForm = useForm<SignInForm>({
        defaultValues: signInFormDefaults,
        resolver: yupResolver(signInValidationSchema),
    });

    const signUpForm = useForm<SignUpForm>({
        defaultValues: signUpFormDefaults,
        resolver: yupResolver(signUpValidationSchema),
    });

    const onSignInSubmit = async (data: SignInForm) => {
        signInForm.reset();
        await dispatch(login(data));
        navigate('/', { replace: true });
    };

    const onSignUpSubmit = async (data: SignUpForm) => {
        signUpForm.reset();
        await dispatch(registration(data));
        navigate('/', { replace: true });
    };

    const changePasswordVisibility = () => setShowPassword((show) => !show);

    const changeActiveTab = (tabValue: AuthTab) => {
        setActiveTab(tabValue);
        return tabValue === 'signIn' ? signUpForm.reset() : signInForm.reset();
    };

    return (
        <div className={styles.authPageWrapper}>
            <section className={styles.formSection}>
                <img className={styles.logo} src={FishtLogo} alt="Fisht Icon" />

                <section className={styles.authTabsSection}>
                    <AuthTabs activeTab={activeTab} changeActiveTab={changeActiveTab} />
                </section>

                <form
                    className={styles.authForm}
                    onSubmit={
                        activeTab === 'signIn'
                            ? signInForm.handleSubmit(onSignInSubmit)
                            : signUpForm.handleSubmit(onSignUpSubmit)
                    }
                >
                    {activeTab === 'signIn' ? (
                        <SignInFields
                            showPassword={showPassword}
                            form={signInForm}
                            handleClickShowPassword={changePasswordVisibility}
                        />
                    ) : (
                        <SignUpFields
                            showPassword={showPassword}
                            form={signUpForm}
                            handleClickShowPassword={changePasswordVisibility}
                        />
                    )}
                    <Button size="large" variant="contained" type="submit">
                        {activeTab === 'signIn' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                </form>
            </section>
        </div>
    );
};
