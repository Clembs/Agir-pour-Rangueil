export async function load({ locals: { getUser } }) {
	const user = getUser();

	return {
		user
	};
}
