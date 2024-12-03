import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserFromGoogleId(googleId: string) {
	return db.query.user.findFirst({
		where: eq(userTable.googleId, googleId)
	});
}

export async function createUser(googleId: string, username: string) {
	await db.insert(userTable).values({
		googleId,
		username
	});

	const user = getUserFromGoogleId(googleId);
	if (!user) {
		throw new Error('Failed to create user');
	}

	return user;
}
