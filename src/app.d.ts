import type { User, Session, UserWithPosts } from '$lib/server/db/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		interface PageData {
			user: UserWithPosts | null | undefined;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
