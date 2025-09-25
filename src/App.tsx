import { Toaster } from 'sonner';
import './App.css';
import AppRoutes from './core/routes/routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './core/contexts/AppProvider';
import { AuthProvider } from './features/auth';

function App() {
	return (
		<Router>
			<AppProvider>
				<AuthProvider>
					<AppRoutes />
				</AuthProvider>
				<Toaster position="bottom-left" />
			</AppProvider>
		</Router>
	);
}

export default App;
