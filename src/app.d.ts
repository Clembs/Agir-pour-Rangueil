import type { Post, Session, User } from '$lib/server/db/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: () => Session | null;
			getUser: () =>
				| (User & {
						posts: Post[];
						likes: Like[];
				  })
				| null
				| undefined;
		}
		interface PageData {
			user:
				| (User & {
						posts: Post[];
						likes: Like[];
				  })
				| null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
