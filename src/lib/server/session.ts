import { db } from '$lib/server/db';
import { session as sessionTable } from '$lib/server/db/schema';
import type { Session } from '$lib/server/db/types';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

const _15_DAYS = 15 * 24 * 60 * 60 * 1000;
const _30_DAYS = 30 * 24 * 60 * 60 * 1000;

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await db.query.session.findFirst({
		where: eq(sessionTable.id, sessionId),
		with: {
			user: true
		}
	});

	if (!row) return { session: null, user: null };

	const { user, ...session } = row;

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() - _15_DAYS) {
		session.expiresAt = new Date(Date.now() + _30_DAYS);
		await db.update(sessionTable).set(session).where(eq(sessionTable.id, session.id));
	}

	return { session, user };
}

export function invalidateSesion(sesionId: string) {
	db.delete(sessionTable).where(eq(sessionTable.id, sesionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: expiresAt
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.set('session', '', {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
}

export function generateSessionToken() {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token: string, userId: number) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await db.insert(sessionTable).values(session);
	return session;
}
