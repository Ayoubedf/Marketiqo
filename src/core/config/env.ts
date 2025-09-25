interface ClientEnvVars {
	VITE_API_BASE_URL: string;
	VITE_APP_NAME: string;
}

function getClientEnvVars(): ClientEnvVars {
	const { VITE_API_BASE_URL, VITE_APP_NAME } = import.meta.env;

	const required = {
		VITE_API_BASE_URL,
		VITE_APP_NAME,
	};

	const missingVars = Object.entries(required).filter(([, value]) => !value);

	if (missingVars.length > 0) {
		const keys = missingVars.map(([key]) => key).join(', ');
		throw new Error(`Missing required environment variables: ${keys}`);
	}

	return {
		VITE_API_BASE_URL,
		VITE_APP_NAME,
	};
}

const env = getClientEnvVars();

export default env;
