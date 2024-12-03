import type { post, user } from './schema';

export type User = typeof user.$inferSelect;

export type Post = typeof post.$inferSelect & {
	author: User;
};

export type UserWithPosts = User & {
	posts: Post[];
};
