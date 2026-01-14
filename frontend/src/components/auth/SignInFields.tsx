import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

type SignInFieldsProps = {
	showPassword: boolean;
	handleClickShowPassword: () => void;
}

export const SignInFields = ({ showPassword, handleClickShowPassword }: SignInFieldsProps) => {
	return (
		<>
			<FormControl variant="outlined">
				<InputLabel htmlFor="login">Логин</InputLabel>
				<OutlinedInput
					id="login"
					type='text'
					label="Логин"
					autoComplete='user'
				/>
			</FormControl>
			<FormControl variant="outlined">
				<InputLabel htmlFor="password">Пароль</InputLabel>
				<OutlinedInput
					id="password"
					type={showPassword ? 'text' : 'password'}
					label="Пароль"
					autoComplete="current-password"
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
			<Button size='large' variant="contained">Войти</Button>
		</>
	)
}
