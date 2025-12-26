import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL('sitemap-index.xml', site);

	return new Response(
		`User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}`,
		{
			headers: {
				'Content-Type': 'text/plain',
				'Cache-Control': 'public, max-age=86400, s-maxage=86400',
			},
		}
	);
};
