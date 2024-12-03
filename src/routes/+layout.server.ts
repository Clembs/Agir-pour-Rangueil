export async function load({ locals: { getUser } }) {
	return {
		user: await getUser()
	};
}
