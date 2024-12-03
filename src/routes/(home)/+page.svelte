<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Header from '$components/Header.svelte';
	import Post from '$components/Post.svelte';

	let { data } = $props();
</script>

<Header>
	{m.home()}
</Header>

<main>
	<div class="posts">
		{#await data.posts}
			<Post skeleton />
			<Post skeleton />
			<Post skeleton />
		{:then posts}
			{#each posts as post}
				<Post {post} />
			{/each}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</div>
</main>

<style lang="scss">
	main {
		padding-top: 0;
	}

	.posts {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
