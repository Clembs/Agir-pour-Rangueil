<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$components/Button.svelte';
	import TextInput from '$components/TextInput.svelte';

	let { form } = $props();
	let loading = $state(false);
</script>

<main>
	<h1>Choisissez un nom d'utilisateur</h1>

	<p>Ce nom sera visible par les autres utilisateurs. Il doit être entre 3 et 20 caractères.</p>

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
			placeholder="Nom d'utilisateur"
			error={form?.message}
		/>

		<Button>Continuer</Button>
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
