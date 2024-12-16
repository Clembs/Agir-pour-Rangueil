import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { OAuth2Client } from 'google-auth-library';

let googleAuthClient: OAuth2Client;

export const getGoogleAuthClient = (origin: string) =>
	(googleAuthClient ??= new OAuth2Client(
		GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET,
		`${origin}/login/google/callback`
	));
