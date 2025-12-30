import { StoreProvider } from 'app/providers/StoreProvider';
import { RouterProvider } from 'app/providers/RouterProvider';

export const AppProviders = () => {
	return (
		<StoreProvider>
			<RouterProvider />
		</StoreProvider>
	)
}