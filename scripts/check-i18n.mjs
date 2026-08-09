import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Comprueba que ninguna página exportada contiene claves de traducción sin
 * resolver ("Navbar.section1" en vez de "Inicio").
 *
 * Es la red de seguridad de `CLIENT_NAMESPACES` (src/i18n/clientMessages.ts):
 * si un componente de cliente usa un namespace que no se le pasa al provider,
 * next-intl no lanza, imprime la clave. Aquí sí falla.
 */

const OUT = new URL('../out/', import.meta.url).pathname;

const NAMESPACES = Object.keys(
    JSON.parse(readFileSync(new URL('../src/messages/es.json', import.meta.url), 'utf8')),
);

const KEY_PATTERN = new RegExp(`>(${NAMESPACES.join('|')})\\.[A-Za-z0-9_.]+<`, 'g');

function* htmlFiles(dir) {
    for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) yield* htmlFiles(path);
        else if (entry.endsWith('.html')) yield path;
    }
}

let failures = 0;

for (const file of htmlFiles(OUT)) {
    const found = [...readFileSync(file, 'utf8').matchAll(KEY_PATTERN)].map((m) => m[0].slice(1, -1));
    if (found.length > 0) {
        failures += found.length;
        console.error(`✗ ${file.replace(OUT, '')}: ${[...new Set(found)].join(', ')}`);
    }
}

if (failures > 0) {
    console.error(
        `\n${failures} claves sin traducir. Añade el namespace a CLIENT_NAMESPACES en src/i18n/clientMessages.ts.`,
    );
    process.exit(1);
}

console.log('✓ i18n: ninguna clave sin resolver en las páginas exportadas');
