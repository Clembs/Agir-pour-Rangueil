import { db } from '$lib/server/db';

export async function load() {
	const posts = db.query.post.findMany({
		with: { author: true }
	});

	return {
		posts
	};
}
