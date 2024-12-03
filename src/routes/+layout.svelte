<script lang="ts">
	import '../app.scss';

	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
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
			<main>
				{@render children()}
			</main>
		</div>
	</IconContext>
</ParaglideJS>
