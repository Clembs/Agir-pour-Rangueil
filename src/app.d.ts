import type { User } from '$lib/server/db/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getUser: (id?: number) => Promise<User | null | undefined>;
		}
		interface PageData {
			user: User | null | undefined;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
