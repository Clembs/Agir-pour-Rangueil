import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ['agir-pour-rangueil-tunnel.clembs.com']
	},
	optimizeDeps: {
		exclude: ['phosphor-svelte']
	}
});
