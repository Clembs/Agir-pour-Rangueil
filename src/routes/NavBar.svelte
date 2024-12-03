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
						<svelte:component this={item.icon} size={20} weight={isCurrent ? 'fill' : 'regular'} />
					</div>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		backdrop-filter: blur(99px);
		background-color: rgba(255, 255, 255, 0.5);
		z-index: 1000;

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
				padding: 0.75rem 0;
				font-size: 11px;

				.icon {
					display: grid;
					place-items: center;
					padding: 0.25rem 1rem;
					border-radius: 999px;
				}

				&[aria-current='true'] {
					font-weight: 600;
					.icon {
						color: var(--color-surface);
						background-color: var(--color-on-surface);
					}
				}
			}
		}
	}
</style>
