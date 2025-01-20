import type { like, post, session, user } from './schema';

export type User = typeof user.$inferSelect;

export type Session = typeof session.$inferSelect;

export type Post = typeof post.$inferSelect & {
	author: User;
	likes: Like[];
};

export type Like = typeof like.$inferSelect;
