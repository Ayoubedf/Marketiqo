import { Toaster } from 'sonner';
import './App.css';
import AppRoutes from './routes/Routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './contexts/AppProvider';
import { AuthProvider } from './contexts/AuthProvider';

function App() {
	return (
		<>
			<Router>
				<AppProvider>
					<AuthProvider>
						<AppRoutes />
					</AuthProvider>
					<Toaster position="bottom-left" />
				</AppProvider>
			</Router>
		</>
	);
}

export default App;
