import { read } from '$app/server';
import bgPattern from './background-pattern.jpg';

export function GET() {
	const file = read(bgPattern);

	return new Response(file.body, {
		headers: {
			// cache forever
			'Cache-Control': 'public, max-age=31536000',
			'Content-Type': 'image/jpeg'
		}
	});
}
