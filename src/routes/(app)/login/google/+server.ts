import { getGoogleAuthClient } from '$lib/server/oauth';

import { redirect } from '@sveltejs/kit';

export async function GET({ url }): Promise<Response> {
	const redirectUrl = getGoogleAuthClient(url.origin).generateAuthUrl({
		access_type: 'online',
		scope: ['openid']
	});

	redirect(302, redirectUrl);
}
