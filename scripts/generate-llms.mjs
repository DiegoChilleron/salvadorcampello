#!/usr/bin/env node
/**
 * Genera public/llms.txt siguiendo el formato de llmstxt.org.
 *
 * Se alimenta de lo que ya existe en el repo —los mensajes de i18n y los listados de
 * vídeo— para que no pueda divergir del contenido real de la web. Se engancha al script
 * `prebuild` de package.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public/llms.txt');
const BASE = 'https://salvadorcampello.com';

const messages = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/messages/es.json'), 'utf8'));
const { Curriculum: cv, PortfolioMultimedia: portfolio, Metadata: meta, Schema: schema } = messages;

/**
 * Los paths se leen de `src/config/routes.ts` en vez de repetirlos: es la fuente única
 * del sitio y así renombrar una ruta allí se refleja aquí. Se extraen con regexp porque
 * este script es .mjs y no puede importar TypeScript.
 */
function readRoutes() {
    const src = fs.readFileSync(path.join(ROOT, 'src/config/routes.ts'), 'utf8');
    const routes = {};

    for (const [, key, body] of src.matchAll(/(\w+):\s*\{([^}]*)\}/g)) {
        const es = body.match(/es:\s*'([^']*)'/);
        if (es) routes[key] = es[1];
    }

    const required = ['home', 'portfolio', 'legalNotice', 'privacyPolicy', 'cookiesPolicy'];
    const missing = required.filter((k) => !(k in routes));
    if (missing.length > 0) {
        throw new Error(`generate-llms: no se pudieron leer las rutas ${missing.join(', ')} de src/config/routes.ts`);
    }

    return routes;
}

/** URL absoluta con barra final (`trailingSlash: true`). */
const url = (p) => `${BASE}${p === '/' ? '/' : `${p}/`}`;

const CATEGORIES = [
    ['telenit', portfolio.subtitle1, portfolio.description1],
    ['entrevistas', portfolio.subtitle2, portfolio.description2],
    ['eventos', portfolio.subtitle3, portfolio.description3],
];

function readCategory(id) {
    const file = path.join(ROOT, `public/assets/data/listado_${id}.json`);
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8')).filter((v) => v?.videoId);
    } catch {
        return [];
    }
}

const routes = readRoutes();
const lines = [];
const push = (...l) => lines.push(...l);

push('# Salvador Campello');
push('');
push(`> ${schema.personDescription} ${meta.description}`);
push('');

// ── Respuestas directas ──────────────────────────────────────────────────────
// Los LLMs citan mejor pares pregunta/respuesta explícitos que prosa corrida.
push('## Respuestas directas');
push('');
push('**¿Quién es Salvador Campello?**');
push(cv.clipboardbiography.split('\n\n')[0]);
push('');
push('**¿A qué se dedica?**');
push(
    `${cv.expblock1.job1} de ${cv.expblock1.company} (${cv.expblock1.date1.toLowerCase()}). ` +
    `${cv.expblock1.description1} También es ${cv.expblock1.job3.toLowerCase()} de informativos ` +
    `y profesor en la ${cv.formblock1.university}.`
);
push('');
push('**¿Dónde ver su trabajo?**');
push(
    `El portfolio multimedia reúne sus informativos, entrevistas y retransmisiones: ${url(routes.portfolio)}`
);
push('');

// ── Biografía completa ───────────────────────────────────────────────────────
push('## Biografía');
push('');
for (const paragraph of cv.clipboardbiography.split('\n\n')) push(paragraph, '');

// ── Trayectoria ──────────────────────────────────────────────────────────────
push('## Experiencia');
push('');
for (let i = 1; i <= 6; i++) {
    const block = cv[`expblock${i}`];
    if (!block) continue;
    const job = block.job ?? block.job1;
    const date = block.date ?? block.date1;
    const description = block.description ?? block.description1;
    push(`- **${block.company}** — ${job} (${date}). ${description}`);
}
push('');

push('## Formación');
push('');
for (let i = 1; i <= 4; i++) {
    const block = cv[`formblock${i}`];
    if (!block) continue;
    push(`- **${block.title}**, ${block.university} (${block.date}). ${block.description}`);
}
push('');

// ── Portfolio ────────────────────────────────────────────────────────────────
push('## Portfolio multimedia');
push('');
push(`Vídeos publicados en YouTube, agrupados en tres secciones: ${url(routes.portfolio)}`);
push('');

for (const [id, name, description] of CATEGORIES) {
    const videos = readCategory(id);
    push(`### ${name.charAt(0).toUpperCase()}${name.slice(1)} (${videos.length} vídeos)`);
    push('');
    push(description);
    push('');
    // Solo una muestra: listar los ~1.800 haría el fichero inservible.
    if (videos.length > 0) {
        push('Ejemplos recientes:');
        for (const video of videos.slice(0, 10)) {
            push(`- ${video.title} — https://www.youtube.com/watch?v=${video.videoId}`);
        }
        push('');
    }
}

// ── Páginas ──────────────────────────────────────────────────────────────────
push('## Páginas');
push('');
push(`- Inicio: ${url(routes.home)}`);
push(`- Portfolio multimedia: ${url(routes.portfolio)}`);
push('');
push('Versiones en otros idiomas: /en/, /ca/, /it/');
push('');

push('## Legal');
push('');
push(`- Aviso legal: ${url(routes.legalNotice)}`);
push(`- Política de privacidad: ${url(routes.privacyPolicy)}`);
push(`- Política de cookies: ${url(routes.cookiesPolicy)}`);
push('');

fs.writeFileSync(OUT, lines.join('\n'), 'utf8');

const total = CATEGORIES.reduce((sum, [id]) => sum + readCategory(id).length, 0);
console.log(
    `llms.txt generado: ${CATEGORIES.length} categorías, ${total} vídeos indexados ` +
    `-> ${path.relative(ROOT, OUT)}`
);
