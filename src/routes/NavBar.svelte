<script lang="ts">
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';
	import { House, PlusSquare, Ranking, TreeEvergreen, UserCircle } from 'phosphor-svelte';

	const navItems = [
		{
			icon: House,
			label: m.home(),
			href: '/'
		},
		{
			icon: Ranking,
			label: m.ranking(),
			href: '/classement'
		},
		{
			icon: PlusSquare,
			label: m.create(),
			href: '/poster'
		},
		{
			icon: TreeEvergreen,
			label: m.forest(),
			href: '/foret'
		},
		{
			icon: UserCircle,
			label: m.my_profile(),
			href: '/profil'
		}
	];
</script>

<nav>
	<ul>
		{#each navItems as item}
			{@const isCurrent = $page.url.pathname === item.href}
			<li>
				<a href={item.href} aria-current={isCurrent}>
					<div class="icon">
						<svelte:component this={item.icon} weight={isCurrent ? 'fill' : 'duotone'} />
					</div>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		margin-top: auto;
		backdrop-filter: blur(999px);
		background-color: rgba(0, 0, 0, 0.5);

		ul {
			display: flex;
			// justify-content: space-between;
			list-style: none;

			li {
				width: 100%;
			}

			a {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0.25rem;
				padding: 0.5rem 0;
				font-size: 12px;

				.icon {
					display: grid;
					place-items: center;
					padding: 0.25rem 1.5rem;
					border-radius: 999px;
				}

				&[aria-current='true'] {
					.icon {
						background-color: var(--color-surface-dim);
					}
				}
			}
		}
	}
</style>
