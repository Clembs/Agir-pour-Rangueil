<script lang="ts">
	import NavBar from './NavBar.svelte';

	let { children } = $props();
</script>

{@render children()}

<NavBar />
