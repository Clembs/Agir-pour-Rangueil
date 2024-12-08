<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		variant = 'leaf',
		'background-color': backgroundColor,
		'text-color': textColor,
		children,
		onclick,
		disabled,
		type
	}: {
		href?: string;
		variant?: 'leaf' | 'colored';
		'background-color'?: string;
		'text-color'?: string;
		children: Snippet;
		onclick?: () => void;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
	} = $props();
</script>

{#if href && !onclick}
	<a
		class={variant}
		style:--color-background={backgroundColor}
		style:--color-on-background={textColor}
		{href}
		target={!href.startsWith('/') ? '_blank' : ''}
		rel={!href.startsWith('/') ? 'noopener noreferrer' : ''}
		draggable="false"
		aria-disabled={disabled}
	>
		{@render children()}
	</a>
{:else}
	<button
		{onclick}
		class={variant}
		style:--color-background={backgroundColor}
		style:--color-on-background={textColor}
		{disabled}
		{type}
	>
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
		padding: 1rem 1.25rem;
		background-color: black;
		color: white;
		text-align: center;
		cursor: initial;
		border-radius: 99px;
		font-weight: 500;
		transition: transform 0.2s;

		&.leaf {
			background-color: var(--color-accent);
			color: var(--color-on-accent);
		}

		&.colored {
			--bg: var(--color-background, hsl(0, 0%, 100%));
			background-color: var(--bg);
			color: var(--color-on-background, hsl(0, 0%, 0%));
		}

		&:hover:active {
			transform: scale(0.95);
		}
	}
	button:disabled,
	a[aria-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
