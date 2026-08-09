/**
 * Bloque `<script type="application/ld+json">` con el grafo ya serializado.
 *
 * Escapa `<` como `\u003c` (secuencia válida dentro de una cadena JSON, así que
 * el grafo se sigue parseando igual): sin eso, un texto traducido que contuviera
 * `</script>` cerraría la etiqueta antes de tiempo y el resto del grafo acabaría
 * pintado como HTML en la página.
 */
export function JsonLdScript({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, '\\u003c'),
            }}
        />
    );
}
