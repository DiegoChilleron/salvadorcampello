#!/usr/bin/env bash
#
# Recorta la fuente variable de Open Sans a lo que usa la web.
#
# El original de Google (src/fonts/source/OpenSans-VariableFont.woff2) pesa 274 KB: trae
# griego, cirílico, hebreo y vietnamita (1.140 glifos) y dos ejes, peso (wght) y anchura
# (wdth). La web solo escribe en castellano, inglés, valenciano e italiano, y nunca cambia
# la anchura. Como la fuente se precarga en todas las páginas, esos 274 KB competían con
# las imágenes del hero en la carga inicial.
#
# Resultado: src/fonts/OpenSans-Latin-Variable.woff2 (~63 KB), con
#   - latín básico, Latin-1 y Latin Extended-A (incluye la «ŀ» del valenciano);
#   - puntuación general («“”», «–», «…»), € y ™;
#   - el eje wght entero (300–800) y wdth fijado a 100.
# Lo que no está en el recorte (p. ej. los emojis de algunos títulos de vídeo) lo pinta la
# fuente del sistema, igual que antes: el original tampoco los tenía.
#
# Solo hace falta ejecutarlo si se cambia la fuente de origen. Requiere fonttools:
#   python3 -m pip install fonttools brotli
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=src/fonts/source/OpenSans-VariableFont.woff2
OUT=src/fonts/OpenSans-Latin-Variable.woff2
UNICODES="U+0000-00FF,U+0100-017F,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

python3 -m fontTools.subset "$SRC" \
    --unicodes="$UNICODES" \
    --layout-features='*' \
    --flavor=woff2 \
    --output-file="$TMP/subset.woff2"

python3 - "$TMP/subset.woff2" "$OUT" <<'PY'
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

font = instancer.instantiateVariableFont(TTFont(sys.argv[1]), {"wdth": 100})
font.flavor = "woff2"
font.save(sys.argv[2])
PY

echo "✓ $OUT ($(wc -c < "$OUT" | tr -d ' ') bytes)"
