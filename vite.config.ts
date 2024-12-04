import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

if (!process.env.KEY_PATH || !process.env.CERTIFICATE_PATH) {
	console.warn(
		"No KEY_PATH or CERTIFICATE_PATH environment variables found. HTTPS development won't work without them."
	);
} else {
	console.log('Using HTTPS development.');
}

export default defineConfig({
	plugins: [
		sveltekit(),
		paraglide({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],
	...(process.env.KEY_PATH && process.env.CERTIFICATE_PATH
		? {
				server: {
					https: {
						key: fs.readFileSync(path.resolve(__dirname, process.env.KEY_PATH)),
						cert: fs.readFileSync(path.resolve(__dirname, process.env.CERTIFICATE_PATH))
					},
					host: '0.0.0.0'
				}
			}
		: {}),
	optimizeDeps: {
		exclude: ['phosphor-svelte']
	}
});
