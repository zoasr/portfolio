import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
	const body: { theme: string | undefined } = await request.json();
	if (body.theme) {
		cookies.set("theme", body.theme);
		return new Response(
			JSON.stringify({
				message: "Theme set!",
			}),
			{
				status: 200,
			}
		);
	} else {
		return new Response(
			JSON.stringify({
				message: "Theme not set!",
			}),
			{
				status: 400,
			}
		);
	}
};

export const GET: APIRoute = async ({ request, cookies }) => {
	console.log(new URL(request.url).searchParams.get("theme"), request.url);

	const sentTheme = new URL(request.url).searchParams.get("theme");
	if (!sentTheme) {
		return new Response(
			JSON.stringify({
				message: "Theme not set!",
			}),
			{
				status: 400,
			}
		);
	}
	cookies.set("theme", sentTheme);

	return new Response(
		JSON.stringify({
			message: "Theme set!",
		}),
		{
			status: 200,
		}
	);
};
