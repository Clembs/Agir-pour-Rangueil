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
		<div class="skeleton-content"></div>
		<div class="skeleton-image"></div>
		<div class="skeleton-content"></div>
	{:else}
		<div class="header">
			<!-- TODO: include author avatar -->
			<a href="/users/{post.author.id}" class="profile">
				<div class="skeleton-avatar"></div>
				{post.author.username}
			</a>
			<span class="subtext"> • </span>
			<time class="subtext" datetime={post.createdAt?.toISOString()}>
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
					<Heart size={32} />
				</button>
				<button>
					<ChatCircle size={32} />
				</button>
				<button>
					<ShareFat size={32} />
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
		gap: 0.5rem;

		.header {
			display: flex;
			align-items: center;
			gap: 0.5ch;

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

		.skeleton-avatar {
			display: inline-block;
			background-color: var(--color-surface-dim);
			border-radius: 999px;
			width: 2rem;
			height: 2rem;
		}

		.skeleton-image {
			background: var(--color-surface-dim);
		}

		.skeleton-content {
			height: 1.5rem;
			background: var(--color-surface-dim);
		}

		img {
			object-fit: cover;
			object-position: center;
		}

		img,
		.skeleton-image {
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

			.view-comments-button {
				padding: 0.5rem 1rem;
				border-radius: 0.5rem;
				background-color: var(--color-surface-dim);
				font-weight: 500;
				font-size: 14px;
			}
		}
	}
</style>
