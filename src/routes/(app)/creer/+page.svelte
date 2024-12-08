<script lang="ts">
	import Camera from './Camera.svelte';
	import PostComposer from './PostComposer.svelte';

	let currentStep = $state<'camera' | 'composer'>('camera');
	let imageBase64 = $state('');
</script>

<main>
	{#if currentStep === 'camera'}
		<Camera
			oncapture={(imageData) => {
				imageBase64 = imageData;
				currentStep = 'composer';
			}}
		/>
	{:else if currentStep === 'composer'}
		<PostComposer
			{imageBase64}
			oncancel={() => {
				currentStep = 'camera';
				imageBase64 = '';
			}}
		/>
	{/if}
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 0.5rem;
		min-height: 100vh;
		min-height: 100dvh;
	}
</style>
