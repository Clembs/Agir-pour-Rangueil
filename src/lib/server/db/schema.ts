import { relations } from 'drizzle-orm';
import { mysqlTable, int, varchar, text, primaryKey, timestamp } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: int('id').autoincrement().primaryKey(),
	googleId: varchar('google_id', { length: 255 }).unique().notNull(),
	username: varchar('username', { length: 32 }).unique().notNull(),
	acorns: int('acorns').notNull().default(0)
});

export const userRelations = relations(user, ({ many }) => ({
	likes: many(like),
	posts: many(post)
}));

export const session = mysqlTable('session', {
	id: varchar('id', { length: 32 }).primaryKey(),
	userId: int('userId').references(() => user.id),
	expiresAt: timestamp('expiresAt').notNull()
});

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const post = mysqlTable('post', {
	id: int('id').autoincrement().primaryKey(),
	authorId: int('author_id')
		.notNull()
		.references(() => user.id),
	content: varchar('content', { length: 260 }).notNull(),
	imageUrl: text('image_url').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const postRelations = relations(post, ({ one, many }) => ({
	author: one(user, {
		fields: [post.authorId],
		references: [user.id]
	}),
	likes: many(like),
	comments: many(comment)
}));

export const like = mysqlTable(
	'like',
	{
		userId: int('userId'),
		postId: int('postId')
	},
	({ userId, postId }) => ({
		id: primaryKey({ columns: [userId, postId] })
	})
);

export const likeRelations = relations(like, ({ one }) => ({
	post: one(post, {
		fields: [like.postId],
		references: [post.id]
	}),
	user: one(user, {
		fields: [like.userId],
		references: [user.id]
	})
}));

export const comment = mysqlTable('comment', {
	id: int('id').autoincrement().primaryKey(),
	authorId: int('author_id')
		.notNull()
		.references(() => user.id),
	postId: int('post_id')
		.notNull()
		.references(() => post.id),
	content: varchar('content', { length: 260 }).notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const commentRelations = relations(comment, ({ one }) => ({
	post: one(post, {
		fields: [comment.postId],
		references: [post.id]
	}),
	author: one(user, {
		fields: [comment.authorId],
		references: [user.id]
	})
}));
