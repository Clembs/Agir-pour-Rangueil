import { db } from '$lib/server/db';

export async function load() {
	const posts = db.query.posts.findMany({
		with: {
			author: true,
			likes: true,
			comments: {
				with: {
					author: true
				}
			}
		}
	});

	return {
		posts
	};
}
