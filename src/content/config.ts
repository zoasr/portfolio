import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';

const pages = defineCollection({
	loader: glob({ pattern: '**/*.{astro,md,mdx}', base: './src/pages' }),
});

export const collections = { pages };
