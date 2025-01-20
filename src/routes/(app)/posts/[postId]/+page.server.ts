import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	if (!params.postId || isNaN(parseInt(params.postId))) {
		error(404, 'Post non trouvé');
	}

	const postId = parseInt(params.postId);

	const post = await db.query.post.findFirst({
		where: ({ id }, { eq }) => eq(id, postId),
		with: {
			likes: true,
			author: true,
			comments: {
				with: {
					author: true
				}
			}
		}
	});

	if (!post) {
		error(404, 'Post non trouvé');
	}

	return {
		post
	};
}
