<script lang="ts">
	import '../app.scss';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import NavBar from './NavBar.svelte';
	import { IconContext } from 'phosphor-svelte';

	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<IconContext
		values={{
			size: 24,
			weight: 'duotone'
		}}
	>
		<div class="viewport">
			{@render children()}

			<NavBar />
		</div>
	</IconContext>
</ParaglideJS>
