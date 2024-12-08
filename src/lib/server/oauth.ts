import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { OAuth2Client } from 'google-auth-library';

export const googleAuthClient = new OAuth2Client(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	'http://localhost:5173/login/google/callback'
);
