import { db } from '$lib/server/db';

export async function load({ setHeaders }) {
	const posts = db.query.post.findMany({
		with: { author: true }
	});

	setHeaders({
		'Cache-Control': 'public, max-age=300'
	});

	return {
		posts
	};
}
