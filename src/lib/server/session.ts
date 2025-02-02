import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { encodeBase32 } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

const _15_DAYS = 15 * 24 * 60 * 60 * 1000;
const _30_DAYS = 30 * 24 * 60 * 60 * 1000;

export async function refreshSession({ cookies }: RequestEvent, sessionId: string) {
	const session = await db.query.sessions.findFirst({
		where: eq(sessions.id, sessionId)
	});

	if (!session) return null;

	// if the session has expired, delete it and return null
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		return null;
	}

	// if the session is about to expire, extend it
	if (Date.now() >= session.expiresAt.getTime() - _15_DAYS) {
		const expiresAt = new Date(Date.now() + _30_DAYS);
		await db
			.update(sessions)
			.set({
				expiresAt
			})
			.where(eq(sessions.id, session.id));

		cookies.set('session_id', sessionId, {
			httpOnly: true,
			path: '/',
			secure: import.meta.env.PROD,
			sameSite: 'lax',
			maxAge: _30_DAYS / 1000
		});

		return {
			...session,
			expiresAt
		};
	}

	return session;
}

export function deleteSession({ cookies }: RequestEvent, sessionId: string) {
	db.delete(sessions).where(eq(sessions.id, sessionId));

	cookies.delete('session_id', {
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
}

export function generateSessionId() {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);

	const token = encodeBase32(tokenBytes).toLowerCase();
	return token;
}

export async function createSession({ cookies }: RequestEvent, userId: number) {
	const sessionId = generateSessionId();

	await db.insert(sessions).values({
		id: sessionId,
		expiresAt: new Date(Date.now() + _30_DAYS),
		userId
	});

	cookies.set('session_id', sessionId, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: _30_DAYS / 1000
	});
}
