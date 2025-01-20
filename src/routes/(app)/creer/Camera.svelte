<script lang="ts">
	import Skeleton from '$components/Skeleton.svelte';
	import { ArrowsCounterClockwise, Camera, CameraSlash, ImagesSquare } from 'phosphor-svelte';
	import { onMount } from 'svelte';

	let videoState = $state<'ready' | 'loading' | 'error'>('loading');
	let wrapperEl = $state<HTMLDivElement>();
	let videoEl = $state<HTMLVideoElement>();
	let currentTrack = $state<MediaStreamTrack>();
	let videoDevices = $state<MediaDeviceInfo[]>([]);

	let {
		oncapture
	}: {
		oncapture: (image: string) => void;
	} = $props();

	onMount(async () => {
		if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
			try {
				// get the first camera
				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: {
							ideal: localStorage.getItem('cameraFacingMode') || 'user'
						}
					}
				});

				if (stream.active && videoEl) {
					videoEl.srcObject = stream;
					currentTrack = stream.getVideoTracks()[0];
					videoState = 'ready';

					// check if there's more than one camera
					videoDevices = (await navigator.mediaDevices.enumerateDevices()).filter(
						(device) => device.kind === 'videoinput'
					);
				}
			} catch (error) {
				videoState = 'error';
			}
		} else {
			videoState = 'error';
		}
	});

	async function capture() {
		if (!videoEl || videoState === 'error' || !currentTrack || !wrapperEl) return;

		// haptic feedback
		if ('vibrate' in navigator) {
			navigator.vibrate(10);
		}

		// pause the video feed to animate
		videoEl.pause();
		const animation = wrapperEl.animate([{ scale: 1 }, { scale: 0.9 }, { scale: 1 }], {
			duration: 300
		});
		// let the animation finish
		await animation.finished;

		const canvas = document.createElement('canvas');
		// get the smallest dimension of the video feed (depending on the orientation usually)
		const minDimension = Math.min(videoEl.videoWidth, videoEl.videoHeight);
		canvas.width = minDimension;
		canvas.height = minDimension;

		const context = canvas.getContext('2d');

		// get the X/Y starting offset to center the image
		const offsetX = (videoEl.videoWidth - minDimension) / 2;
		const offsetY = (videoEl.videoHeight - minDimension) / 2;

		// draw to canvas
		context?.drawImage(
			videoEl,
			offsetX,
			offsetY,
			minDimension,
			minDimension,
			0,
			0,
			canvas.width,
			canvas.height
		);

		// export to a base64 webp
		const data = canvas.toDataURL('image/webp');

		oncapture(data);
	}

	async function switchCamera() {
		if (
			!videoEl ||
			videoState === 'error' ||
			!currentTrack ||
			videoDevices.length === 1 ||
			!wrapperEl
		)
			return;

		// animate the arrows icon
		const arrows = document.getElementById('arrows');
		arrows?.animate([{ rotate: '0deg' }, { rotate: '-180deg' }], { duration: 125 });

		const newFacingMode = currentTrack.getSettings().facingMode === 'user' ? 'environment' : 'user';

		// haptic feedback
		if ('vibrate' in navigator) {
			navigator.vibrate(10);
		}

		// get the camera facing the other way
		const stream = await navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: newFacingMode
			}
		});

		if (stream.active) {
			videoEl.pause();

			const animation = wrapperEl.animate(
				[{ transform: 'scaleX(1)' }, { transform: 'scaleX(0.2)' }],
				{ duration: 125 }
			);

			await animation.finished;

			// once the first half of the animation is done, switch the video stream
			videoEl.srcObject = stream;
			currentTrack = stream.getVideoTracks()[0];

			// complete the animation
			wrapperEl.animate([{ transform: 'scaleX(0.2)' }, { transform: 'scaleX(1)' }], {
				duration: 125
			});

			videoEl.play();

			// save the new facing mode
			localStorage.setItem('cameraFacingMode', newFacingMode);
		}
	}

	function choosePicture(ev: { currentTarget?: HTMLInputElement }) {
		if (!ev.currentTarget || !ev.currentTarget.files) return;

		const file = ev.currentTarget.files[0];

		// base64 encode the image
		const reader = new FileReader();

		reader.onload = () => {
			oncapture(reader.result as string);
		};

		reader.readAsDataURL(file);
	}
</script>

<div id="camera-wrapper" bind:this={wrapperEl}>
	{#if videoState === 'loading'}
		<Skeleton height="100%" width="100%" rounded={false} />
	{:else if videoState === 'error'}
		<div id="error-text">
			<CameraSlash size={48} />

			<!-- TODO: localize -->
			<h1>Camera access has been denied</h1>

			<p>
				You can choose a picture from your gallery, or grant camera access in your permission
				settings.
			</p>
		</div>
	{/if}

	<video ondblclick={switchCamera} disablePictureInPicture autoplay muted bind:this={videoEl}
	></video>
</div>

<div id="main-actions">
	<label for="file-input" class="action">
		<ImagesSquare weight="fill" />
		<input
			onchange={choosePicture}
			type="file"
			name="file-input"
			id="file-input"
			accept="image/*"
		/>
	</label>

	<button onclick={capture} disabled={videoState !== 'ready'} id="take-picture" class="action">
		<Camera weight="fill" />
	</button>

	<button
		onclick={switchCamera}
		disabled={videoState !== 'ready' || videoDevices.length === 1}
		class="action"
	>
		<ArrowsCounterClockwise id="arrows" weight="fill" />
	</button>
</div>

<style lang="scss">
	#camera-wrapper {
		aspect-ratio: 1;
		height: auto;
		width: 100%;
		overflow: hidden;
		border-radius: 2rem;
		margin-bottom: 1rem;

		#error-text {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			gap: 1.5rem;
			padding: 1rem;
			height: 100%;
			width: 100%;
			background-color: var(--color-surface);
			color: var(--color-on-surface);

			h1 {
				text-align: center;
				text-wrap: balance;
			}
		}

		video {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	#main-actions {
		display: flex;
		gap: 1rem;

		.action {
			border: none;
			background-color: var(--color-surface);
			color: var(--color-on-surface);
			padding: 1.25rem;
			border-radius: 99px;
			display: grid;
			place-items: center;
			transition: transform 0.2s;

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}

			:global(#arrows) {
				transition: transform 0.125s;
			}

			&:hover:active {
				transform: scale(0.95);

				// start the animation subtly
				&:global(:has(#arrows) #arrows) {
					transform: rotate(20deg);
				}
			}
		}

		#take-picture {
			width: 100%;
			flex-grow: 1;
			background-color: var(--color-accent);
			color: var(--color-on-accent);
		}

		label {
			input {
				display: none;
			}
		}
	}
</style>
