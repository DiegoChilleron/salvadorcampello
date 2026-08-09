'use client';

import { useState } from 'react';

interface CopyBioButtonProps {
    bio: string;
    copyLabel: string;
    copiedLabel: string;
}

/**
 * Única parte del currículum que necesita cliente. Recibe los textos ya
 * resueltos para que el namespace `Curriculum` (≈45 claves, con una biografía
 * de 2,5 KB) no tenga que serializarse entero al navegador.
 */
export const CopyBioButton = ({ bio, copyLabel, copiedLabel }: CopyBioButtonProps) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(bio);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            className="button w-60"
            data-reveal="fade-in"
            onClick={copyToClipboard}
            style={
                {
                    backgroundColor: copied ? '#4CAF50' : '',
                    transition: 'background-color 0.3s',
                    '--reveal-duration': '1s',
                } as React.CSSProperties
            }
        >
            {copied ? copiedLabel : copyLabel}
        </button>
    );
};
