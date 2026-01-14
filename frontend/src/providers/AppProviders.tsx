import { StoreProvider } from '@/providers/StoreProvider';
import { RouterProvider } from '@/providers/RouterProvider';

export const AppProviders = () => {
	return (
		<StoreProvider>
			<RouterProvider />
		</StoreProvider>
	)
}