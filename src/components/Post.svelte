<script lang="ts">
	import { formatRelativeTime } from '$lib/format';
	import { language } from '$lib/i18n';
	import type { Post } from '$lib/server/db/types';
	import { ChatCircle, Heart, ShareFat } from 'phosphor-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		post,
		skeleton
	}:
		| {
				post: Post;
				skeleton?: false;
		  }
		| {
				post?: undefined;
				skeleton: true;
		  } = $props();
</script>

<article>
	{#if skeleton || !post}
		<div class="skeleton-image"></div>
		<div class="skeleton-content"></div>
	{:else}
		<div class="header">
			<!-- TODO: include author avatar -->
			<span class="username">@{post.author.username}</span>
			<time datetime={post.createdAt?.toISOString()}>
				{formatRelativeTime(post.createdAt, $language)}
			</time>
		</div>

		<img src={post.imageUrl} alt="Related to the post" />

		<div class="profile-content">
			<p>{post.content}</p>
		</div>

		<!-- TODO: make these look nicer and functional -->
		<div class="buttons">
			<div class="primary-actions">
				<button>
					<Heart />
				</button>
				<button>
					<ChatCircle />
				</button>
				<button>
					<ShareFat />
				</button>
			</div>

			<a class="view-comments-button" href="/posts/{post.id}">
				{m.comments()}
			</a>
		</div>
	{/if}
</article>

<style lang="scss">
	article {
		margin: 1rem 0;
		// padding: 1rem;
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.username {
				font-size: 1.1rem;
				font-weight: 500;
			}
		}

		.skeleton-image {
			width: 300px;
			height: 300px;
			background: #ddd;
		}

		.skeleton-content {
			height: 1.5rem;
			background: #ddd;
		}

		img {
			aspect-ratio: 1;
			// height: auto;
			object-fit: cover;
			object-position: center;
		}

		.buttons {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
