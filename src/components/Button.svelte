<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		variant = 'leaf',
		color,
		children,
		onclick
	}: {
		href?: string;
		variant?: 'leaf' | 'colored';
		color?: string;
		children: Snippet;
		onclick?: () => void;
	} = $props();
</script>

{#if href && !onclick}
	<a
		class={variant}
		style:--color={color}
		{href}
		target={!href.startsWith('/') ? '_blank' : ''}
		rel={!href.startsWith('/') ? 'noopener noreferrer' : ''}
		draggable="false"
	>
		{@render children()}
	</a>
{:else}
	<button {onclick} class={variant} style:--color={color}>
		{@render children()}
	</button>
{/if}

<style lang="scss">
	button,
	a {
		display: flex;
		width: 100%;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		padding: 0.75rem 1rem;
		background-color: black;
		color: white;
		text-align: center;
		cursor: initial;
		border-radius: 1rem;

		&.leaf {
			background-image: url('./assets/leaf.png');
			background-position: bottom right;
			text-shadow: 0px 3px 4px rgba(0, 0, 0, 0.4);
			font-weight: 500;
			box-shadow:
				inset 0px 3px 4px rgba(255, 255, 255, 0.4),
				inset 0px -3px 4px rgba(0, 0, 0, 0.4),
				0px 3px 5px #55870430;
		}

		&.colored {
			background-color: var(--color);
			color: white;
			box-shadow:
				0px 3px 4px rgba(0, 0, 0, 0.4),
				0px -3px 4px rgba(255, 255, 255, 0.4),
				0px 3px 5px #00000030;
		}
	}
</style>
