import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AppProviders } from 'app/providers/AppProviders';

import 'shared/styles/index.scss';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppProviders />
	</StrictMode>,
)
