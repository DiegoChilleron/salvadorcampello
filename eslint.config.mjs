import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const eslintConfig = [
    ...coreWebVitals,
    ...typescript,
    {
        rules: {
            // Con `output: 'export'` e `images.unoptimized`, next/image renderiza el mismo
            // <img> pero añade su runtime al JS de cliente: no hay optimizador ni srcset que
            // ganar. Las imágenes importadas usan `StaticImg` (src/components/UI/StaticImg.tsx).
            '@next/next/no-img-element': 'off',
        },
    },
    {
        // `.github/` contiene el script Node de la GitHub Action, no código de la app.
        ignores: ['.next/**', 'out/**', 'node_modules/**', '.github/**'],
    },
];

export default eslintConfig;
