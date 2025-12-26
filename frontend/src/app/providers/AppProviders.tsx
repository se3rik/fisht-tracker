import { StoreProvider } from 'app/providers/StoreProvider';

type AppProvidersProps = {
	children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
	return <StoreProvider>{children}</StoreProvider>
}