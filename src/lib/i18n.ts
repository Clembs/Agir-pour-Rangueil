import { page } from '$app/stores';
import * as runtime from '$lib/paraglide/runtime';
import { createI18n } from '@inlang/paraglide-sveltekit';
import { get, readable } from 'svelte/store';

export const i18n = createI18n(runtime);

export const language = readable('en', (set) => {
	set(i18n.getLanguageFromUrl(get(page).url));

	return () => {};
});
