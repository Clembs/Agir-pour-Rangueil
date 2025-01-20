import type { likes, posts, sessions, users } from './schema';

export type User = typeof users.$inferSelect;

export type Session = typeof sessions.$inferSelect;

export type Post = typeof posts.$inferSelect & {
	author: User;
	likes: Like[];
};

export type Like = typeof likes.$inferSelect;
