import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { setSessionTokenCookie, validateSessionToken } from '$lib/server/session';
import { deleteSessionTokenCookie } from '$lib/server/session';

export const handle: Handle = async (input) => {
	const handleParaglide: Handle = i18n.handle();
	handleParaglide(input);

	const { event, resolve } = input;

	const sessionId = event.cookies.get('session_id');

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { user, session } = await validateSessionToken(sessionId);
	if (session !== null) setSessionTokenCookie(event, sessionId, session.expiresAt);
	else deleteSessionTokenCookie(event);

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};
