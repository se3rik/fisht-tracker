import styles from './AuthPage.module.scss'

import FishtLogo from "shared/assets/icons/FishtLogo.svg"

export const AuthPage = () => {
	return (
		<div className={styles.authPageWrapper}>
			<section className={styles.formSection}>
				<img className={styles.logo} src={FishtLogo} alt="Fisht Icon" />
				<form className={styles.authForm}></form>
			</section>
		</div>
	)
}
