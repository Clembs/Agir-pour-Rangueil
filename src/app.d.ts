import type { UserWithPosts } from '$lib/server/db/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getUser: (id?: number) => Promise<UserWithPosts | null | undefined>;
		}
		interface PageData {
			user: UserWithPosts | null | undefined;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
