import { googleAuthClient } from '$lib/server/oauth';

import { redirect } from '@sveltejs/kit';

export async function GET(): Promise<Response> {
	const url = googleAuthClient.generateAuthUrl({
		access_type: 'online',
		scope: ['openid']
	});

	redirect(302, url);
}
