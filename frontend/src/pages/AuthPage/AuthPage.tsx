import { useState } from 'react';

import styles from './AuthPage.module.scss';

import FishtLogo from "@/assets/icons/FishtLogo.svg";

import { AuthTabs } from '@/components/auth/AuthTabs';
import { SignUpFields } from '@/components/auth/SignUpFields';
import { SignInFields } from '@/components/auth/SignInFields';

import type { AuthTab } from '@/types/auth/AuthTabs';

export const AuthPage = () => {
	const [activeTab, setActiveTab] = useState<AuthTab>('signIn');
	const [showPassword, setShowPassword] = useState(false);

	const changePasswordVisibility = () => setShowPassword((show) => !show);
	const changeActiveTab = (tabValue: AuthTab) => setActiveTab(tabValue);

	return (
		<div className={styles.authPageWrapper}>
			<section className={styles.formSection}>
				<img className={styles.logo} src={FishtLogo} alt="Fisht Icon" />

				<section className={styles.authTabsSection}>
					<AuthTabs activeTab={activeTab} changeActiveTab={changeActiveTab} />
				</section>

				<form className={styles.authForm}>
					{activeTab === "signIn" ? (
						<SignInFields showPassword={showPassword} handleClickShowPassword={changePasswordVisibility} />
					) : (
						<SignUpFields showPassword={showPassword} handleClickShowPassword={changePasswordVisibility} />
					)}
				</form>
			</section>
		</div >
	)
}
