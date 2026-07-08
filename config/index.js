const config = {
	app: {
		name: import.meta.env.APP_NAME ,
		host: import.meta.env.APP_HOST,
		port: import.meta.env.NODE_PORT,
		service: import.meta.env.APP_SERVICE,
		version: import.meta.env.APP_VERSION,
		shutdown: import.meta.env.APP_SHUTDOWN,
		clientHost: import.meta.env.APP_CLIENT_HOST,
		env: import.meta.env.APP_ENV || 'development',
	},
	api: {
		base_url: import.meta.env.VITE_BASE_API_URL,
	},
	download: {
		base_url: import.meta.env.VITE_BASE_API_URL + '/download',
	},
	services: {
		googleMap: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
	},
};

export default config;
