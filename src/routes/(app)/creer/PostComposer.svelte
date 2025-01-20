<script lang="ts">
	import Button from '$components/Button.svelte';
	import TextInput from '$components/TextInput.svelte';
	import { CaretLeft, PaperPlaneRight } from 'phosphor-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let {
		imageBase64,
		oncancel
	}: {
		imageBase64: string;
		oncancel: () => void;
	} = $props();

	let postingState = $state<'initial' | 'loading' | 'error' | 'success'>('initial');
</script>

<form
	use:enhance={() => {
		postingState = 'loading';
		return async ({ result, update }) => {
			if (result.type === 'success') {
				postingState = 'success';
			} else if (result.type === 'failure') {
				postingState = 'error';
			}
			await update();
		};
	}}
	action="/api/posts?/createPost"
	method="post"
>
	{$page.form?.message}
	<div id="preview-image">
		<input type="hidden" name="image-base64" value={imageBase64} />
		<img src={imageBase64} alt="Camera preview" />
	</div>

	<div class="transition">
		<TextInput
			label={m.create_content_label()}
			minheight={100}
			maxlength={250}
			name="content"
			multiline
		/>

		<div id="buttons">
			<Button type="button" variant="colored" onclick={oncancel}>
				<CaretLeft size={20} />
				{m.back()}
			</Button>

			<Button disabled={postingState === 'loading'}>
				<PaperPlaneRight size={20} />
				{#if postingState === 'loading'}
					{m.uploading()}
				{:else}
					{m.create()}
				{/if}
			</Button>
		</div>
	</div>
</form>

<style lang="scss">
	form {
		display: contents;
	}

	#preview-image {
		aspect-ratio: 1;
		height: auto;
		width: 100%;
		overflow: hidden;
		border-radius: 2rem;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	#buttons {
		display: flex;
		gap: 1rem;
	}
</style>
