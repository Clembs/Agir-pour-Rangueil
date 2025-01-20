<script lang="ts">
	import Button from '$components/Button.svelte';
	import { Acorn, Confetti, GoogleLogo, PlusSquare } from 'phosphor-svelte';
</script>

<main>
	<h1>Bienvenue sur Agir pour Rangueil (bêta)</h1>

	<p>
		Un réseau social développé par des étudiant•es de l'IUT Paul Sabatier pour encourager l'action
		écologique.
	</p>

	<ul>
		<li><PlusSquare /> Postez des photos de vos actions écologiques</li>
		<li><Acorn /> Collectez des points et participez à la forêt virtuelle (À venir)</li>
		<li>
			<Confetti />
			Participez à des quiz pour mettre vos connaissances écologiques à l'épreuve (À venir)
		</li>
	</ul>

	<Button variant="colored" background-color="blue" text-color="white" href="/login/google">
		<GoogleLogo weight="bold" />
		Se connecter avec Google
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
