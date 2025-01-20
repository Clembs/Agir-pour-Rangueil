import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { neon } from '@neondatabase/serverless';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const connection = neon(env.DATABASE_URL);

export const db = drizzle({
	client: connection,
	schema,
	casing: 'snake_case'
});
