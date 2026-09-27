import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Comprueba que cada imagen Open Graph exportada casa con exactamente una regla de
 * `_headers` (la que le fija `Content-Type: image/png`).
 *
 * next/og las escribe sin extensión, así que sin esa regla Cloudflare Pages las sirve como
 * `application/octet-stream` y las redes sociales enseñan la tarjeta sin imagen. Es un fallo
 * que no se ve navegando la web: una página nueva con su `opengraph-image.tsx` y sin su par de
 * reglas en `public/_headers` lo reintroduce. Aquí falla el build.
 *
 * Reproduce el emparejamiento de Pages: `*` casa con cualquier secuencia de caracteres, pero
 * solo se admite uno por regla. Una regla con dos (la antigua `/*opengraph-image*`) no casa con
 * nada en Pages, así que aquí se descarta y se avisa.
 */

const OUT = new URL('../out/', import.meta.url).pathname;

const patterns = readFileSync(join(OUT, '_headers'), 'utf8')
    .split('\n')
    .filter((line) => line.startsWith('/'));

let failures = 0;

for (const pattern of patterns.filter((p) => p.split('*').length > 2)) {
    failures++;
    console.error(`✗ public/_headers: "${pattern.trim()}" tiene más de un comodín; Cloudflare Pages no la aplica`);
}

const rules = patterns
    .filter((p) => p.split('*').length <= 2)
    .map((pattern) => ({
        pattern,
        regex: new RegExp(`^${pattern.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`),
    }));

function* ogImages(dir) {
    for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) {
            if (entry !== '_next') yield* ogImages(path);
        } else if (entry.startsWith('opengraph-image') && !entry.endsWith('.txt')) {
            yield `/${relative(OUT, path)}`;
        }
    }
}

let checked = 0;

for (const url of ogImages(OUT)) {
    checked++;
    const matches = rules.filter((rule) => rule.regex.test(url));
    if (matches.length !== 1) {
        failures++;
        const detail = matches.length === 0 ? 'ninguna regla' : `${matches.length} reglas (${matches.map((m) => m.pattern).join(', ')})`;
        console.error(`✗ ${url}: casa con ${detail} de public/_headers`);
    }
}

if (failures > 0) {
    console.error(
        `\n${failures} imagen(es) Open Graph sin una regla única en public/_headers: se servirían como application/octet-stream.`,
    );
    process.exit(1);
}

console.log(`✓ headers: las ${checked} imágenes Open Graph tienen su regla en _headers`);
