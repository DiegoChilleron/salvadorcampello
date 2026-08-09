import localFont from 'next/font/local';

export const openSans = localFont({
    src: '../fonts/OpenSans-VariableFont.woff2',
    weight: '300 800',
    style: 'normal',
    display: 'swap',
    variable: '--font-open-sans',
});
