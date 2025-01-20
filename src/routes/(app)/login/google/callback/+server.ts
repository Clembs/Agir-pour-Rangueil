import { getGoogleAuthClient } from '$lib/server/oauth';

import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import type { User } from '$lib/server/db/types';
import type { Credentials, TokenInfo } from 'google-auth-library';
import { createSession } from '$lib/server/session';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = decodeURI(event.url.searchParams.get('code')!);

	let tokens: Credentials;
	try {
		tokens = (await getGoogleAuthClient(event.url.origin).getToken(code)).tokens;
	} catch (e) {
		console.error(e);
		error(400, "Erreur lors de la validation du code d'autorisation. Veuillez réessayer.");
	}

	let tokenInfo: TokenInfo;
	try {
		tokenInfo = await getGoogleAuthClient(event.url.origin).getTokenInfo(tokens.access_token!);
	} catch (e) {
		console.error(e);
		error(500, "Erreur lors de la validation du jeton d'accès. Veuillez réessayer.");
	}

	if (!tokenInfo || !tokenInfo.sub) {
		error(500, "Erreur lors de la validation du jeton d'accès. Veuillez réessayer.");
	}

	let user: Pick<User, 'id'> | undefined = await db.query.user.findFirst({
		where: ({ googleId }, { eq }) => eq(googleId, tokenInfo.sub!)
	});

	const newUser = !user;

	if (!user) {
		try {
			user = (
				await db
					.insert(userTable)
					.values({ googleId: tokenInfo.sub!, username: tokenInfo.sub! })
					.$returningId()
			)[0];
		} catch (e) {
			console.error(e);
			error(500, "Erreur lors de la création de l'utilisateur.");
		}
	}

	try {
		await createSession(event, user.id);
	} catch (e) {
		console.error(e);
		error(500, 'Erreur lors de la création de la session.');
	}

	if (newUser) {
		redirect(302, '/onboarding/username');
	} else {
		redirect(302, '/');
	}
}
