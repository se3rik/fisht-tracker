import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import { loginSuccess } from '@/stores/slices/authSlice';

import styles from './AuthPage.module.scss';

import Button from '@mui/material/Button';
import { AuthTabs, SignUpFields, SignInFields } from '@/components/auth';

import FishtLogo from '@/assets/icons/FishtLogo.svg';

import type { AuthTab, SignInForm, SignUpForm } from '@/types/auth';
import { signInFormDefaults, signUpFormDefaults } from '@/constants/authDefaultsForms';
import { signInValidationSchema, signUpValidationSchema } from '@/validation/authValidation';

export const AuthPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const onSignInSubmit = (data: SignInForm) => {
        console.log('SIGN IN', data);
        signInForm.reset();
        dispatch(loginSuccess('mock-jwt-token'));
        navigate('/', { replace: true });
    };

    const onSignUpSubmit = (data: SignUpForm) => {
        console.log('SIGN UP', data);
        signUpForm.reset();
        dispatch(loginSuccess('mock-jwt-token'));
        navigate('/', { replace: true });
    };

    const changePasswordVisibility = () => setShowPassword((show) => !show);

    const changeActiveTab = (tabValue: AuthTab) => {
        setActiveTab(tabValue);

        if (tabValue === 'signIn') {
            signUpForm.reset();
        } else {
            signInForm.reset();
        }
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
