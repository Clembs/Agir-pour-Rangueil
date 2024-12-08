<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$components/Button.svelte';
	import TextInput from '$components/TextInput.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { form } = $props();
	let loading = $state(false);
</script>

<main>
	<h1>{m.choose_username_header()}</h1>

	<p>{m.change_username_description()}</p>

	<form
		use:enhance={() => {
			loading = true;
		}}
		action="/api/profile?/changeUsername&onboarding"
		method="post"
	>
		<TextInput
			name="username"
			minlength={3}
			maxlength={20}
			placeholder={m.username()}
			error={form?.message}
		/>

		<Button>
			{m.button_continue()}
		</Button>
	</form>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		justify-content: end;
		align-items: center;
		gap: 1rem;

		min-height: 100vh;
		min-height: 100dvh;

		h1,
		p {
			text-align: center;
		}

		h1 {
			text-wrap: balance;
		}

		form {
			display: contents;
		}
	}
</style>
