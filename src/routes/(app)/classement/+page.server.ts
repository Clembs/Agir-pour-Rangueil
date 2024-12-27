import { db } from '$lib/server/db';
import { like, post, user } from '$lib/server/db/schema.js';
import { and, countDistinct, eq, gte, inArray, lt, sql } from 'drizzle-orm';

export async function load({ setHeaders }) {
	const allTimeRanking = await db.query.user.findMany({
		columns: {
			username: true,
			acorns: true
		},
		orderBy: ({ acorns }, { desc }) => desc(acorns),
		limit: 5
	});

	const now = new Date();
	const ONE_DAY = 1000 * 60 * 60 * 24;
	const one_week_ago = new Date(now.getTime() - 7 * ONE_DAY);

	const postsLastWeekSubQuery = db
		.select({
			id: post.id
		})
		.from(post)
		.where(and(gte(post.createdAt, one_week_ago), lt(post.createdAt, now)));

	const weeklyRanking = await db
		.select({
			id: user.id,
			username: user.username,
			postPoints: countDistinct(post.id).mapWith((value) => value * 300),
			likePoints: countDistinct(like.postId).mapWith((value) => value * 10)
		})
		.from(user)
		.leftJoin(
			post,
			and(eq(user.id, post.authorId), gte(post.createdAt, one_week_ago), lt(post.createdAt, now))
		)
		.leftJoin(like, and(eq(user.id, like.userId), inArray(like.postId, postsLastWeekSubQuery)))
		.groupBy(user.id, user.username)
		.orderBy(sql`3 desc`, sql`4 desc`);

	setHeaders({
		'Cache-Control': 'public, max-age=300'
	});

	return {
		ranking: {
			weekly: weeklyRanking.map((rank) => ({
				id: rank.id,
				username: rank.username,
				acorns: rank.postPoints + rank.likePoints
			})),
			allTime: allTimeRanking
		}
	};
}
