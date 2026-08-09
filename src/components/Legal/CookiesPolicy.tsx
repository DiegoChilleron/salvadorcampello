import { Link } from '@/i18n/navigation';
import { routePath } from '@/config/routes';

export const CookiesPolicy = () => {
    const updateDate = '22/08/2025';
    return (
        <section className="legal-container">
            <h1>Política de Cookies</h1>
            <p><small>Última actualización: {updateDate}</small></p>

            <h2>1. Introducción</h2>
            <p>
                Esta Política de Cookies explica el uso de tecnologías de almacenamiento en el sitio web <a href="https://salvadorcampello.com">salvadorcampello.com</a> (el &quot;Sitio&quot;).
                El Sitio NO utiliza cookies propias ni cookies de terceros con fines de analítica, publicidad, personalización o seguimiento.<br />
                Únicamente se pueden llegar a establecer cookies de terceros cuando el usuario decide reproducir un vídeo incrustado de YouTube. Hasta ese momento no se almacena ninguna cookie.
            </p>

            <h2>2. ¿Qué son las cookies?</h2>
            <p>
                Las cookies son pequeños archivos de texto que se descargan en su dispositivo al visitar determinadas páginas web. Sirven (según su tipo) para permitir el funcionamiento técnico, recordar preferencias, medir audiencia o mostrar publicidad personalizada.
                Esta web funciona sin necesidad de instalar cookies no esenciales.
            </p>

            <h2>3. Situación en este Sitio</h2>
            <ul>
                <li><strong>Cookies propias:</strong> No se emplean.</li>
                <li><strong>Cookies de terceros:</strong> No se cargan de forma preventiva. Solo pueden establecerse si el usuario pulsa en reproducir un vídeo de YouTube.</li>
            </ul>
            <p>Los vídeos se incrustan utilizando el modo de privacidad mejorada de YouTube (<code>youtube-nocookie.com</code>), lo que evita la instalación de cookies hasta la interacción voluntaria (clic en reproducir). A partir de ese momento YouTube (Google Ireland Limited) puede establecer cookies técnicas y, si el usuario mantiene sesión iniciada en Google, asociar la reproducción a su cuenta conforme a sus propias políticas.</p>

            <h2>4. Base jurídica y consentimiento</h2>
            <p>
                Al no utilizarse cookies no necesarias antes de su interacción, no se muestra banner ni se solicita consentimiento previo (conforme a la Directiva ePrivacy y normativa europea). El clic en “reproducir” constituye una acción afirmativa que habilita la carga del contenido externo de YouTube y la eventual instalación de sus cookies.
            </p>

            <h2>5. Gestión y bloqueo de cookies</h2>
            <p>Puede bloquear o eliminar cookies desde la configuración de su navegador. Si bloquea las de YouTube no podrá reproducir los vídeos incrustados.</p>
            <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="nofollow">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="nofollow">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="nofollow">Safari</a></li>
                <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="nofollow">Microsoft Edge</a></li>
                <li><a href="https://support.google.com/accounts/answer/32050" target="_blank" rel="nofollow">Android / Chrome móvil</a></li>
            </ul>

            <h2>6. Información sobre YouTube</h2>
            <p>Para más detalles consulte las políticas de Google:</p>
            <ul>
                <li><a href="https://policies.google.com/privacy?hl=es" target="_blank" rel="nofollow">Política de Privacidad de Google</a></li>
                <li><a href="https://policies.google.com/technologies/cookies?hl=es" target="_blank" rel="nofollow">Política de Cookies de Google</a></li>
            </ul>

            <h2>7. Derechos del usuario</h2>
            <p>
                Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad respecto a los datos personales tratados por este Sitio contactando a través de los medios indicados en la sección de contacto. Los tratamientos derivados de la reproducción de vídeos corresponden a YouTube / Google, debiendo dirigirse a ellos para el ejercicio de derechos sobre dichos datos.
            </p>

            <h2>8. Actualizaciones</h2>
            <p>
                Esta política puede actualizarse para reflejar cambios legales o técnicos. Se recomienda revisarla periódicamente.
            </p>
            <div className='py-10'>
                <Link href={routePath('home', 'es')} className="button">Volver a inicio</Link>
            </div>
        </section>
    );
};
