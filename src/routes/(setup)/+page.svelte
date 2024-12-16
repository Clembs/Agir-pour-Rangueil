<script lang="ts">
	import Button from '$components/Button.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { Acorn, AppleLogo, Confetti, GoogleLogo, PlusSquare } from 'phosphor-svelte';
</script>

<main>
	<h1>{m.welcome_header()}</h1>

	<p>{m.welcome_description()}</p>

	<ul>
		<li><PlusSquare /> {m.welcome_post()}</li>
		<li><Acorn /> {m.welcome_acorns()}</li>
		<li>
			<Confetti />
			{m.welcome_quiz()}
		</li>
	</ul>

	<Button variant="colored" background-color="blue" text-color="white" href="/login/google">
		<GoogleLogo weight="bold" />
		{m.login_with_google()}
	</Button>
	<Button
		disabled
		variant="colored"
		background-color="black"
		text-color="white"
		onclick={() => console.log('h')}
	>
		<AppleLogo weight="fill" />
		{m.login_with_apple()}
	</Button>
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

		ul {
			width: 100%;
			max-width: 30rem;
			padding: 1rem;
			list-style: none;
			display: flex;
			flex-direction: column;
			gap: 1rem;

			li {
				display: flex;
				gap: 1rem;

				:global(svg) {
					flex-shrink: 0;
				}
			}
		}
	}
</style>
