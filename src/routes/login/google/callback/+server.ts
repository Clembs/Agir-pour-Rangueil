import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/session';
import { google } from '$lib/server/oauth';
import { decodeIdToken } from 'arctic';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { createUser, getUserFromGoogleId } from '$lib/server/user';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	// const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	if (code === null || storedState === null || codeVerifier === null) {
		return new Response("Missing 'code' or 'state' parameters", {
			status: 400
		});
	}
	// if (state !== storedState) {
	// 	return new Response('Invalid state parameter', {
	// 		status: 400
	// 	});
	// }

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		console.error(e);
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const claims = decodeIdToken(tokens.idToken());
	console.info(claims);
	const googleUserId = claims.sub;
	const username = claims.name;

	// TODO: Replace this with your own DB query.
	const existingUser = await getUserFromGoogleId(googleUserId);

	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	try {
		const user = await createUser(googleUserId, username);
		if (!user) {
			throw new Error('Failed to create user');
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		console.error(e);
		return new Response('Failed to create user', {
			status: 500
		});
	}
}
