<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let compact = $state(false);
	let fontSize = $state('2.5rem');
	let paddingTop = $state('5rem');
	let blur = $state(0);
</script>

<svelte:window
	onscroll={() => {
		compact = window.scrollY > 100;
		// smoothly interpolate between 2.5rem and 1.5rem using the scroll position (stop at 200px)
		fontSize = `${2.5 - Math.min(window.scrollY / 200, 1) * 1}rem`;
		// smoothly interpolate between 4rem and 1.5rem using the scroll position (stop at 200px)
		paddingTop = `${4 - Math.min(window.scrollY / 200, 1) * 3}rem`;
		// smoothly interpolate between 0 and 99 using the scroll position (stop at 200px)
		blur = Math.min(window.scrollY / 200, 1) * 99;
	}}
/>

<header class:compact style:padding-top={paddingTop} style:--blur="{blur}px">
	<h1 style:font-size={fontSize}>
		{@render children()}
	</h1>
</header>

<style lang="scss">
	header {
		display: flex;
		padding: 1rem 1.5rem;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 1000;
		max-width: 500px;
		margin: 0 auto;
		backdrop-filter: blur(var(--blur));

		&.compact {
			background-color: rgba(255, 255, 255, 0.5);
		}
	}
</style>
