<script lang="ts">
	import Header from '$components/Header.svelte';
	import Post from '$components/Post.svelte';
	import Skeleton from '$components/Skeleton.svelte';

	let { data } = $props();
</script>

<Header>
	<!-- TODO: back button -->
	{data.user.username}
</Header>

<main>
	<div class="stats">
		<div class="stat">
			<h2>{data.user.acorns}</h2>
			<p>Points</p>
		</div>
		<!-- TODO: classement -->
		<div class="stat">
			{#await data.posts}
				<Skeleton width="3ch" height="1rem" />
			{:then posts}
				<h2>{posts.length}</h2>
			{/await}
			<p>Posts</p>
		</div>
	</div>

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
		margin-top: 0;
	}

	.stats {
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		gap: 1rem;
		padding: 1rem 0;

		.stat {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5rem;
		}
	}

	.posts {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 0 -1.5rem;
		padding: 0 1.5rem;
		border-top: 2px solid var(--color-surface-dim);
	}
</style>
