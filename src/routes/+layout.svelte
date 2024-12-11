<script lang="ts">
	import '../app.scss';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { IconContext } from 'phosphor-svelte';

	let { children } = $props();
</script>

<svelte:window
	oncontextmenu={(ev) => {
		if (matchMedia('(display-mode: standalone)').matches) {
			ev.preventDefault();
			return;
		}
	}}
/>

<ParaglideJS {i18n}>
	<IconContext
		values={{
			size: 24
			// weight: 'duotone'
		}}
	>
		{@render children()}
	</IconContext>
</ParaglideJS>
