import { db } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export async function load({ parent, params }) {
	const { user: currentUser } = await parent();
	const userId = parseInt(params.id);

	if ((!params.id || isNaN(userId)) && !currentUser) {
		redirect(302, '/');
	}

	const user = !params.id
		? currentUser
		: await db.query.users.findFirst({ where: ({ id }, { eq }) => eq(id, userId) });

	if (!user) {
		error(404, 'Utilisateur introuvable/User not found');
	}

	const posts = db.query.posts.findMany({
		where: ({ authorId }, { eq }) => eq(authorId, user.id),
		orderBy: ({ createdAt }, { desc }) => desc(createdAt),
		with: { author: true, likes: true },
		limit: 10
	});

	return {
		user,
		currentUser,
		posts
	};
}
