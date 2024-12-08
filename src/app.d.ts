import type { Session, User } from '$lib/server/db/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: () => Promise<Session | null | undefined>;
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
