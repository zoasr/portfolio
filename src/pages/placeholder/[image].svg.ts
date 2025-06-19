import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, url }) => {
	const { image } = params;
	const text = url.searchParams.get("text");
	console.log(text);

	if (!image) {
		return new Response("Missing size", { status: 400 });
	}

	const [width, height] = image.split("x").map(Number);

	if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
		return new Response(
			"Invalid size format. Use format `[width]x[height]`.",
			{
				status: 400,
			}
		);
	}

	const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="currentColor" />
  <text x="50%" y="50%" font-family="sans-serif" font-size="50" fill="#333dff" text-anchor="middle" dominant-baseline="middle">
    ${text || `${width}×${height}`}
  </text>
</svg>
  `.trim();

	return new Response(svg, {
		status: 200,
		headers: {
			"Content-Type": "image/svg+xml",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};
