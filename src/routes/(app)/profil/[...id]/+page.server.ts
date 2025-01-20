import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export async function load({ parent, locals: { getUser }, params }) {
	const { user: currentUser } = await parent();
	const id = parseInt(params.id);

	if ((!params.id || isNaN(id)) && !currentUser) {
		error(404, 'Utilisateur invalide/Invalid user');
	}

	const user = !params.id ? currentUser : await getUser(id);

	if (!user) {
		error(404, 'Utilisateur introuvable/User not found');
	}

	const posts = db.query.post.findMany({
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
