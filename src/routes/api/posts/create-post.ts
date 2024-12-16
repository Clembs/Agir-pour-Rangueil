import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { BACKBLAZE_APPLICATION_ID, BACKBLAZE_APPLICATION_KEY } from '$env/static/private';
import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';

export async function createPost({ locals: { getUser }, request, fetch }: RequestEvent) {
	const user = await getUser();

	if (!user) redirect(302, '/');

	const formData = await request.formData();

	const content = formData.get('content')?.toString();
	// base64 webp image
	const imageBase64 = formData.get('image-base64')?.toString();

	if (!content || !imageBase64) {
		return fail(400, { message: 'Missing content or image' });
	}

	const {
		authorizationToken: initialAuthToken,
		apiInfo: {
			storageApi: { apiUrl, bucketId, bucketName, downloadUrl }
		}
	}: {
		authorizationToken: string;
		apiInfo: {
			storageApi: {
				apiUrl: string;
				bucketId: string;
				bucketName: string;
				downloadUrl: string;
			};
		};
	} = await (
		await fetch(`https://api.backblazeb2.com/b2api/v3/b2_authorize_account`, {
			headers: {
				Authorization: `Basic ${Buffer.from(`${BACKBLAZE_APPLICATION_ID}:${BACKBLAZE_APPLICATION_KEY}`).toString('base64')}`
			}
		})
	).json();

	console.log('authorized bb account');

	if (!initialAuthToken || !apiUrl || !bucketId || !downloadUrl) {
		return fail(500, { message: 'Failed to get Backblaze auth token' });
	}

	const {
		uploadUrl,
		authorizationToken: uploadAuthToken
	}: {
		uploadUrl: string;
		authorizationToken: string;
	} = await (
		await fetch(`${apiUrl}/b2api/v3/b2_get_upload_url?bucketId=${bucketId}`, {
			headers: {
				Authorization: initialAuthToken,
				'Content-Type': 'application/json'
			}
		})
	).json();

	console.log('fetched upload url');

	if (!uploadUrl || !uploadAuthToken) {
		return fail(500, { message: 'Failed to get Backblaze upload URL' });
	}

	// random file name
	const fileName = `${Date.now().toString(36) + Math.random().toString(36).substring(2, 15)}.webp`;

	// Convert base64 to file buffer
	const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);

	if (!matches) {
		return fail(400, { message: 'Invalid base64 string format' });
	}

	const [, mimeType, base64] = matches;
	const base64Buffer = Buffer.from(base64, 'base64');

	const hashBuffer = await crypto.subtle.digest('SHA-1', base64Buffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

	// Upload to Backblaze
	const req = await fetch(uploadUrl, {
		method: 'POST',
		headers: {
			Authorization: uploadAuthToken,
			'Content-Length': base64Buffer.byteLength.toString(),
			'Content-Type': mimeType,
			'X-Bz-File-Name': fileName,
			'X-Bz-Info-Author': user.id.toString(),
			'X-Bz-Content-Sha1': hashHex
		},
		body: base64Buffer,
		mode: 'cors'
	});

	if (!req.ok) {
		console.error(await req.text());

		return fail(500, { message: 'Failed to upload image' });
	}

	console.log('uploaded image');
	console.log(await req.json());

	const [{ id }] = await db
		.insert(post)
		.values({
			authorId: user.id,
			imageUrl: `${downloadUrl}/file/${bucketName}/${fileName}`,
			content
		})
		.$returningId();

	redirect(302, `/posts/${id}`);
}
