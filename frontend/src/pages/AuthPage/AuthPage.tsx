import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import styles from './AuthPage.module.scss';

import Button from '@mui/material/Button';

import FishtLogo from '@/assets/icons/FishtLogo.svg';

import { AuthTabs, SignUpFields, SignInFields } from '@/components/auth';

import { signInValidationSchema, signUpValidationSchema } from '@/validation/authValidation';

import type { AuthTab, SignInForm, SignUpForm } from '@/types/auth';
import { signInFormDefaults, signUpFormDefaults } from '@/constants/authDefaultsForms';

export const AuthPage = () => {
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
    };

    const onSignUpSubmit = (data: SignUpForm) => {
        console.log('SIGN UP', data);
        signUpForm.reset();
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
