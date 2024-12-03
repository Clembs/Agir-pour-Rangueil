<script lang="ts">
	import '../app.scss';

	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<div class="content">
		{@render children()}
	</div>
</ParaglideJS>
