import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const eslintConfig = [
    ...coreWebVitals,
    ...typescript,
    {
        // `.github/` contiene el script Node de la GitHub Action, no código de la app.
        ignores: ['.next/**', 'out/**', 'node_modules/**', '.github/**'],
    },
];

export default eslintConfig;
