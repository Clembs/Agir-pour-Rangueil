import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { db } from '$lib/server/db';

export const handle: Handle = (input) => {
	const handleParaglide: Handle = i18n.handle();
	handleParaglide(input);

	const { event, resolve } = input;

	const sessionId = event.cookies.get('session_id');

	event.locals.getUser = async (id?: number) => {
		if (!id) {
			if (!sessionId) {
				return null;
			}

			const session = await db.query.session.findFirst({
				where: ({ id }, { eq }) => eq(id, sessionId),
				with: { user: true }
			});

			return session?.user;
		}

		const user = await db.query.user.findFirst({
			where: ({ id: userId }, { eq }) => eq(userId, id)
		});

		return user;
	};

	return resolve(event);
};
