/// <reference types="vitest" />

import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default ({ mode }) => {
	// Load app-level env vars to node-level env vars.
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return defineConfig({
		plugins: [react()],
		resolve: {
			alias: {
				'@app': path.resolve(__dirname, 'src/App'),
				'@api': path.resolve(__dirname, 'src/api'),
				'@store': path.resolve(__dirname, 'src/store'),
				'@utils': path.resolve(__dirname, 'src/utils'),
				'@utils/*': path.resolve(__dirname, 'src/utils'),
				'@config': path.resolve(__dirname, 'config'),
				'@config/*': path.resolve(__dirname, 'config'),
				'@static/*': path.resolve(__dirname, 'src/static'),
				'@static/images/*': path.resolve(__dirname, 'src/static/images'),
				'@locales': path.resolve(__dirname, 'src/locales'),
				'@locales/*': path.resolve(__dirname, 'src/locales'),
				'@constants': path.resolve(__dirname, 'src/constants'),
				'@constants/*': path.resolve(__dirname, 'src/constants'),
				'@components': path.resolve(__dirname, 'src/components'),
				'@components/*': path.resolve(__dirname, 'src/components'),
				'@src': path.resolve(__dirname, 'src'),
				'@testing': path.resolve(__dirname, 'src/test-setup'),
			},
		},
		server: {
			port: 5050,
		},
		test: {
			environment: 'jsdom',
			globals: true,
			coverage: {
				provider: 'v8',
				reporter: ['text', 'json', 'html'],
			},
			setupFiles: ['./src/test-setup.ts'],
		},
	});
}
