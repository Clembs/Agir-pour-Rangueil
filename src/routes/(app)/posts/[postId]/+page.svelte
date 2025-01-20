<script lang="ts">
	import { enhance } from '$app/forms';
	import Skeleton from '$components/Skeleton.svelte';
	import { formatRelativeTime } from '$lib/format';
	import { ChatCircle, Heart, ShareFat } from 'phosphor-svelte';
	// import TextInput from '$components/TextInput.svelte';
	import { share } from '$components/Post.svelte';

	let { data } = $props();

	let hasLiked = $state(data.user?.likes?.find((l) => l.postId === data.post?.id));
	let likes = $state(data.post?.likes.length);

	$effect(() => {
		if (!data.post || !data.user) return;

		hasLiked = data.user.likes.find((l) => l.postId === data.post.id);
		likes = data.post.likes.length;
	});
</script>

<main>
	<div class="header">
		<!-- TODO: include author avatar -->
		<a href="/profil/{data.post.author.id}" class="profile">
			<Skeleton height="3rem" width="3rem" rounded no-pulse />
			{data.post.author.username}
		</a>
		<span class="subtext"> • </span>
		<time class="subtext" datetime={data.post.createdAt?.toISOString()}>
			{formatRelativeTime(data.post.createdAt)}
		</time>
	</div>

	<!-- random tilt between -2 and 2deg -->
	<img
		src={data.post.imageUrl}
		alt="Related to the post"
		style:rotate="{Math.random() * 2 - 1}deg"
	/>

	<div class="profile-content">
		<p>{data.post.content}</p>
	</div>

	<div class="buttons">
		<div class="primary-actions">
			<form use:enhance action="/api/posts?/likePost&postId={data.post.id}" method="post">
				<button
					type="submit"
					onmousedown={() => {
						hasLiked = !hasLiked;
						likes += hasLiked ? 1 : -1;
					}}
				>
					{#if hasLiked}
						<Heart weight="fill" color="var(--color-accent)" size={32} />
					{:else}
						<Heart size={32} />
					{/if}
				</button>
			</form>
			{likes}

			<button>
				<ChatCircle size={32} />
			</button>

			{data.post.comments.length}

			<button onclick={() => share(data.post)}>
				<ShareFat size={32} />
			</button>
		</div>
	</div>

	<div class="comments">
		<!-- <h2>Commentaires</h2> -->
		<!-- 
		<TextInput name="comment" placeholder="Ajouter un commentaire..." /> -->

		{#each data.post.comments as comment}
			<div class="comment">
				<a href="/profil/{comment.author.id}" class="profile">
					<Skeleton height="2rem" width="2rem" rounded no-pulse />
					{comment.author.username}
				</a>
				<p>{comment.content}</p>
			</div>
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		margin: 1rem auto;
		// padding: 1rem;
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.header {
			display: flex;
			align-items: center;
			gap: 0.5ch;
			width: 100%;

			.profile {
				display: inline-flex;
				gap: 0.5rem;
				align-items: center;
				font-size: 1.1rem;
				font-weight: 500;
			}

			.subtext {
				transform: translateY(1px);
			}
		}

		img {
			object-fit: cover;
			object-position: center;
			box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.25);
			border-radius: 0.5rem;
			aspect-ratio: 1;
			width: 100%;
		}

		.buttons {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.primary-actions {
				display: flex;
				gap: 1rem;
				align-items: center;

				button {
					display: grid;
					place-items: center;
					padding: 0.5rem;
					margin: -0.5rem;
					border: none;
					background: none;
					cursor: pointer;
					background-color: transparent;
					color: inherit;
				}
			}
		}
	}
</style>
