import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/config/site';

// Requerido por `output: 'export'` en las rutas de metadatos.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // Buscadores tradicionales. Bingbot importa más de lo que parece: alimenta
            // Copilot y el índice sobre el que se apoya ChatGPT Search.
            {
                userAgent: ['Googlebot', 'Googlebot-Image', 'Bingbot', 'Slurp', 'DuckDuckBot'],
                allow: '/',
            },
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot'],
                allow: '/',
            },
            {
                userAgent: ['PerplexityBot', 'Perplexity-User'],
                allow: '/',
            },
            {
                userAgent: ['ClaudeBot', 'Claude-User', 'anthropic-ai'],
                allow: '/',
            },
            {
                userAgent: ['Google-Extended'],
                allow: '/',
            },
            // Applebot-Extended necesita declararse explícitamente: Apple lo trata como
            // opt-out por defecto en parte de sus flujos.
            {
                userAgent: ['Applebot', 'Applebot-Extended'],
                allow: '/',
            },
            {
                userAgent: ['Meta-ExternalAgent', 'Meta-ExternalFetcher', 'FacebookBot'],
                allow: '/',
            },
            {
                userAgent: ['Amazonbot', 'cohere-ai', 'DuckAssistBot', 'YouBot', 'PetalBot'],
                allow: '/',
            },
            // CCBot alimenta Common Crawl, que a su vez alimenta el preentrenamiento de
            // casi todos los LLMs: es la vía a citaciones sin navegación en vivo.
            {
                userAgent: ['CCBot'],
                allow: '/',
            },
            {
                // El sitio es un export estático: no hay rutas de API ni privadas
                // que bloquear, así que no se declara ningún disallow.
                userAgent: '*',
                allow: '/',
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
