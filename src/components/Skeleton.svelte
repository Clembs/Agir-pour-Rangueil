<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		height = '1rem',
		width = '100%',
		rounded = true,
		'no-pulse': noPulse = false,
		...restProps
	}: {
		height?: string;
		width?: string;
		rounded?: boolean | 'slightly';
		'no-pulse'?: boolean;
	} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class="skeleton {rounded === 'slightly' ? 'rounded-slightly' : rounded === true ? 'rounded' : ''}"
	class:no-pulse={noPulse}
	style:--height={height}
	style:--width={width}
	{...restProps}
></div>

<style lang="scss">
	@keyframes skeleton-pulse {
		0% {
			filter: brightness(0.9);
		}
		50% {
			filter: brightness(1);
		}
		100% {
			filter: brightness(0.9);
		}
	}

	.skeleton {
		display: inline-block;
		background-color: var(--color-surface-dim);
		height: var(--height);
		width: var(--width);
		animation: skeleton-pulse 1s infinite;
		flex-shrink: 0;

		&.rounded {
			border-radius: 999px;
		}

		&.rounded-slightly {
			border-radius: 0.5rem;
		}

		&.no-pulse {
			animation: none;
		}
	}
</style>
