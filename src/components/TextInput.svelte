<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';

	let {
		type,
		label,
		error,
		name,
		required = true,
		multiline = false,
		minheight = 200,
		value = $bindable(''),
		...restProps
	}: HTMLInputAttributes &
		HTMLTextareaAttributes & {
			name: string;
			label?: string;
			error?: string;
			value?: string;
			multiline?: boolean;
			minheight?: number;
		} = $props();
</script>

<label class="text-input" for={name}>
	{#if label}
		<div class="label-text">
			{label}
		</div>
	{/if}

	<div class="input" class:error>
		{#if !multiline}
			<input {type} id={name} {name} {required} {...restProps} bind:value />
		{:else}
			<textarea
				style="min-height: {minheight}px"
				id={name}
				{name}
				{required}
				{...restProps}
				bind:value
			></textarea>
		{/if}
	</div>

	{#if error || restProps.maxlength}
		<div class="bottom">
			{#if error}
				<p class="error">{error}</p>
			{/if}

			<!-- Whitespace char to always align the max length to the right -->
			&nbsp;

			{#if restProps.maxlength}
				<p>
					{value.length}/{restProps.maxlength.toLocaleString()}
				</p>
			{/if}
		</div>
	{/if}
</label>

<style lang="scss">
	.text-input {
		display: flex;
		flex-direction: column;
		width: 100%;

		.label-text,
		.error {
			font-size: 0.815rem;
			padding: 0.25rem 0.5rem;
		}

		.input {
			display: flex;
			align-items: center;
			border-radius: 1rem;

			&.error {
				border-color: red;
				outline: 1px solid red;
			}

			input,
			textarea {
				padding: 0.75rem 1rem;
				border-radius: 1rem;
				width: 100%;
				background-color: white;
				font-size: 16px;
				border: none;
			}

			&:focus-within {
				box-shadow: 0px 0px 0px 2px var(--color-surface);
			}

			textarea {
				resize: none;
			}
		}

		.bottom {
			display: flex;
			justify-content: space-between;
			color: var(--color-on-surface-dim);
			padding: 0.25rem 0.5rem;
			font-size: 0.75rem;
		}

		.error {
			color: red;
		}
	}
</style>
