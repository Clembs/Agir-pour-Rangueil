<script lang="ts">
	import Button from '$components/Button.svelte';
	import TextInput from '$components/TextInput.svelte';
	import { CaretLeft, PaperPlaneRight } from 'phosphor-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		imageBase64,
		oncancel
	}: {
		imageBase64: string;
		oncancel: () => void;
	} = $props();
</script>

<!-- TODO: form action -->
<form action="" method="post">
	<div id="preview-image">
		<input type="hidden" name="image" value={imageBase64} />
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

			<Button>
				<PaperPlaneRight size={20} />
				{m.create()}
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
