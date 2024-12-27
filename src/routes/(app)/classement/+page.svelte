<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Header from '$components/Header.svelte';

	let { data } = $props();

	data.user = {
		id: 100,
		acorns: 1640,
		googleId: '1234567890',
		username: 'Gérald Lbn'
	};

	let selectedRanking = $state<'allTime' | 'weekly'>('allTime');

	const maxAcorns = $derived.by(() => {
		switch (selectedRanking) {
			case 'allTime':
				return Math.max(...data.ranking.allTime.map((rank) => rank.acorns));
			case 'weekly':
				return Math.max(...data.ranking.weekly.map((rank) => rank.acorns));
		}
	});

	const minAcorns = $derived.by(() => {
		switch (selectedRanking) {
			case 'allTime':
				return Math.min(
					...data.ranking.allTime.filter((rank) => rank.acorns > 0).map((rank) => rank.acorns)
				);
			case 'weekly':
				return Math.min(
					...data.ranking.weekly.filter((rank) => rank.acorns > 0).map((rank) => rank.acorns)
				);
		}
	});

	/**
	 * Normalize a value between 0 and 1.
	 * @param value The value to normalize.
	 * @param offset The offset to apply to the normalized value.
	 */
	const minMaxNormalize = (value: number, offset: number | undefined = 1) => {
		if (maxAcorns === minAcorns) return 1;
		return ((value - minAcorns) / (maxAcorns - minAcorns)) * offset + (1 - offset);
	};
</script>

<Header>
	{m.ranking()}
</Header>

<main>
	<div class="heading">
		<h2>Top 5</h2>
		<select bind:value={selectedRanking}>
			<option value="allTime" selected>All time</option>
			<option value="weekly">Weekly</option>
		</select>
	</div>
	<div class="chart">
		{#each data.ranking[selectedRanking] as rank}
			<div class="rank">
				<div class="avatar"></div>
				{#if rank.acorns}
					<div class="bar" style="--width: {minMaxNormalize(rank.acorns, 0.5) * 100}%">
						{rank.acorns} 🌰
					</div>
				{:else}
					{rank.acorns} 🌰
				{/if}
			</div>
		{/each}
	</div>

	{#if data.user}
		<div class="me-in-ranking">
			<p>{m.myself()}</p>

			<div class="chart">
				<div class="rank">
					<div class="avatar"></div>
					{#if data.user.acorns}
						<div class="bar" style="--width: {minMaxNormalize(data.user.acorns, 0.5) * 100}%">
							{data.user.acorns} 🌰
						</div>
					{:else}
						{data.user.acorns} 🌰
					{/if}
				</div>
			</div>
		</div>
	{/if}
</main>

<style lang="scss">
	main {
		padding-top: 0;
		position: relative;

		.me-in-ranking {
			padding: 1rem;
			width: 100%;

			position: fixed;
			border-top: 1px solid var(--color-surface-dim);
			left: 0;
			bottom: 70px;

			p {
				font-weight: 500;
			}
		}
	}

	.heading {
		display: flex;
		align-items: center;
		justify-content: space-between;

		h2 {
			margin-bottom: 1rem;
		}

		select {
			padding: 0.5rem 1rem;
			border-radius: 9999px;
			background-color: var(--color-surface-dim);
			border: none;
			color: var(--color-on-surface);
			cursor: pointer;
		}
	}

	.chart {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, 1fr);
		gap: 1rem;

		.rank {
			display: flex;
			align-items: center;
			gap: 1rem;

			.avatar {
				width: 3rem;
				height: 3rem;
				border-radius: 9999px;
				background-color: var(--color-on-surface);
				flex: 0 0 auto;
			}

			.bar {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: 0 0.25rem;
				width: var(--width);
				height: 2rem;
				background-color: var(--color-surface-dim);
				border-radius: 0.5rem;
			}
		}
	}
</style>
