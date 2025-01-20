<script lang="ts">
	import '../app.scss';
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

<IconContext
	values={{
		size: 24
		// weight: 'duotone'
	}}
>
	{@render children()}
</IconContext>
