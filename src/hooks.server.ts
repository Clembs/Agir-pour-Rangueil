import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { refreshSession } from '$lib/server/session';
import { db } from '$lib/server/db';

export const handle: Handle = async (input) => {
	const { event, resolve } = input;

	const sessionId = event.cookies.get('session_id');
	const session = sessionId ? await refreshSession(event, sessionId) : null;

	const currentUser = !session
		? null
		: await db.query.user.findFirst({
				where: ({ id: userId }, { eq }) => eq(userId, session.userId!),
				with: {
					likes: true,
					posts: {
						with: {
							likes: true,
							author: true
						}
					}
				}
			});

	event.locals.getSession = () => session;
	event.locals.getUser = () => currentUser;

	const handleParaglide: Handle = i18n.handle();
	handleParaglide(input);

	return await resolve(event);
};
