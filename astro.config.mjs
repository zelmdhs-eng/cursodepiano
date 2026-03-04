// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://paulafranco.com.br',
    output: 'server',
    adapter: vercel(),
    security: {
        checkOrigin: false,
    },
    integrations: [
        react(),
        tailwind(),
        markdoc(),
        sitemap({
            filter: (page) =>
                !page.includes('/admin') &&
                !page.includes('/api') &&
                !page.includes('/setup') &&
                !page.includes('/import')
        })
    ],
    // Reset Trigger: 2026-03-03 08:37
});
