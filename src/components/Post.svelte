<script lang="ts">
	import { formatRelativeTime } from '$lib/format';
	import type { Post } from '$lib/server/db/types';
	import { ChatCircle, Heart, ShareFat } from 'phosphor-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { languageTag } from '$lib/paraglide/runtime.js';
	import Skeleton from './Skeleton.svelte';
	import { page } from '$app/stores';

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

	async function share() {
		if (!post) return;

		let file: File | undefined = undefined;

		try {
			// fetch the image as a blob
			const fileBlob = await (await fetch(post.imageUrl)).blob();

			// the file name doesn't really matter
			file = new File([fileBlob], 'file.webp', {
				type: fileBlob.type
			});
		} catch (error) {
			console.error(error);
		}

		const postAbsoluteUrl = `${$page.url.origin}/posts/${post.id}`;

		const shareData: ShareData = {
			title: post.content,
			text: post.content,
			url: postAbsoluteUrl,
			files: file ? [file] : []
		};

		// share rich content if possible, otherwise fallback to text
		if (navigator.share && navigator.canShare(shareData)) {
			navigator.share(shareData);
		} else {
			navigator.clipboard.writeText(postAbsoluteUrl);
		}
	}
</script>

<article>
	{#if skeleton || !post}
		<div class="header">
			<div class="profile">
				<Skeleton height="2rem" width="2rem" rounded />
				<Skeleton />
			</div>
		</div>
		<Skeleton style="aspect-ratio: 1;" height="auto" width="100%" rounded="slightly" />
		<Skeleton />
	{:else}
		<div class="header">
			<!-- TODO: include author avatar -->
			<a href="/profil/{post.author.id}" class="profile">
				<Skeleton height="2rem" width="2rem" rounded no-pulse />
				{post.author.username}
			</a>
			<span class="subtext"> • </span>
			<time class="subtext" datetime={post.createdAt?.toISOString()}>
				{formatRelativeTime(post.createdAt, languageTag())}
			</time>
		</div>

		<!-- random tilt between -2 and 2deg -->
		<img src={post.imageUrl} alt="Related to the post" style:rotate="{Math.random() * 2 - 1}deg" />

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
				<button onclick={share}>
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
