import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/server/db';
import * as m from '$lib/paraglide/messages.js';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function changeUsername({ locals: { getUser }, url, request }: RequestEvent) {
	const currentUser = await getUser();

	if (!currentUser) redirect(302, '/');

	const formData = await request.formData();
	const newUsername = formData.get('username')?.toString()?.trim();

	if (!newUsername || newUsername.length < 3 || newUsername.length > 20) {
		return fail(400, { message: m.change_username_error_length() });
	}

	if (newUsername === currentUser.username) {
		return { success: true };
	}

	// Check if username is already taken
	const userExists = await db.query.user.findFirst({
		where: ({ username: dbUsername }, { eq }) => eq(dbUsername, newUsername)
	});

	if (userExists) {
		return fail(400, { message: m.change_username_error_taken() });
	}

	await db
		.update(user)
		.set({
			username: newUsername
		})
		.where(eq(user.id, currentUser.id));

	const isOnboarding = url.searchParams.get('onboarding') !== null;

	if (isOnboarding) {
		redirect(302, '/accueil');
	}

	return { success: true };
}
