import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/server/db';
import { likes } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function likePost({ locals: { getUser }, url }: RequestEvent) {
	const currentUser = getUser();

	if (!currentUser) {
		redirect(302, '/');
	}

	const postId = parseInt(url.searchParams.get('postId')!);

	if (!postId || isNaN(postId)) {
		return fail(400, { message: 'Missing or invalid postId' });
	}

	const post = await db.query.posts.findFirst({
		where: ({ id }, { eq }) => eq(id, postId),
		with: {
			likes: true
		}
	});

	if (!post) {
		return fail(404, { message: 'Post not found' });
	}

	// If the user has liked, remove the like
	if (post?.likes.find(({ userId }) => userId === currentUser.id)) {
		await db.delete(likes).where(and(eq(likes.userId, currentUser.id), eq(likes.postId, postId)));
	}
	// If the user has not liked, add the like
	else {
		await db.insert(likes).values({ userId: currentUser.id, postId });
	}

	return { success: true };
}
