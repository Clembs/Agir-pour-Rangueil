import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial().primaryKey(),
	googleId: varchar({ length: 255 }).unique().notNull(),
	username: varchar({ length: 32 }).unique().notNull(),
	acorns: integer().notNull().default(0)
});

export const usersRelations = relations(users, ({ many }) => ({
	likes: many(likes),
	posts: many(posts)
}));

export const sessions = pgTable('sessions', {
	id: varchar({ length: 32 }).primaryKey(),
	userId: integer()
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp().notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const posts = pgTable('posts', {
	id: serial().primaryKey(),
	authorId: integer()
		.notNull()
		.references(() => users.id),
	content: varchar({ length: 260 }).notNull(),
	imageUrl: text().notNull(),
	createdAt: timestamp().notNull().defaultNow()
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id]
	}),
	likes: many(likes),
	comments: many(comments)
}));

export const likes = pgTable('likes', {
	id: serial().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => users.id),
	postId: integer()
		.notNull()
		.references(() => posts.id)
});

export const likesRelations = relations(likes, ({ one }) => ({
	post: one(posts, {
		fields: [likes.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [likes.userId],
		references: [users.id]
	})
}));

export const comments = pgTable('comments', {
	id: integer().primaryKey(),
	authorId: integer()
		.notNull()
		.references(() => users.id),
	postId: integer()
		.notNull()
		.references(() => posts.id),
	content: varchar({ length: 260 }).notNull(),
	createdAt: timestamp().notNull().defaultNow()
});

export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id]
	}),
	author: one(users, {
		fields: [comments.authorId],
		references: [users.id]
	})
}));
