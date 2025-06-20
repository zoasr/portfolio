import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
	const body: { theme: string | undefined } = await request.json();
	if (body.theme) {
		cookies.set("theme", body.theme);
		return new Response(
			JSON.stringify({
				message: "Theme set!",
			})
		);
	} else {
		return new Response(
			JSON.stringify({
				message: "Theme not set!",
			})
		);
	}
};
