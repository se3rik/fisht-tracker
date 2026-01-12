import { createBrowserRouter } from "react-router";

import { App } from 'app/App';
import { HomePage } from 'pages/HomePage/HomePage';
import { AuthPage } from 'pages/AuthPage/AuthPage';

export const router = createBrowserRouter([
	{
		element: <App />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/auth', element: <AuthPage /> }
		]
	},
]);