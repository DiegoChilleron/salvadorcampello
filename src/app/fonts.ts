import localFont from 'next/font/local';

/**
 * Open Sans variable recortada a latín y al eje de peso (63 KB en vez de 274 KB): se
 * precarga en todas las páginas, así que su peso compite con el hero en la carga inicial.
 * Se genera con `scripts/subset-font.sh` a partir de `src/fonts/source/`.
 */
export const openSans = localFont({
    src: '../fonts/OpenSans-Latin-Variable.woff2',
    weight: '300 800',
    style: 'normal',
    display: 'swap',
    variable: '--font-open-sans',
});
