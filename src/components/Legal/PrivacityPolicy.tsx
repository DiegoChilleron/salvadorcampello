import { Link } from '@/i18n/navigation';
import { routePath } from '@/config/routes';

export const PrivacityPolicy = () => {
    return (
        <section className="legal-container">
            <h1>Política de Privacidad</h1>

            <div>
                <h2>Información General</h2>
                <p>En Salvador Campello (<a href="https://salvadorcampello.com">https://salvadorcampello.com</a>), valoramos su privacidad y nos comprometemos a proteger su información personal. Esta política de privacidad describe cómo recopilamos, usamos y protegemos su información cuando visita nuestro sitio web, en cumplimiento con el Reglamento General de Protección de Datos (RGPD) y otras normativas aplicables.</p>
            </div>
            <div>
                <h2>Recopilación de Información</h2>
                <p>Recopilamos información personal a través del formulario de contacto disponible en nuestro sitio web. La información que recopilamos incluye:</p>
                <p><ul>
                    <li><strong>Nombre:</strong> Para identificarlo y dirigirnos a usted de manera adecuada.</li>
                    <li><strong>Correo electrónico:</strong> Para poder responder a sus consultas o comentarios.</li>
                    <li><strong>Mensaje:</strong> Cualquier información adicional que usted desee compartir con nosotros.</li>
                </ul></p>
                <p>La recopilación de esta información se realiza únicamente con su consentimiento explícito, que se solicita al enviar el formulario de contacto.</p>
            </div>
            <div>
                <h2>Uso de Información</h2>
                <p>La información que recopilamos a través del formulario de contacto se utiliza únicamente para los siguientes fines:</p>
                <p><ul>
                    <li>Responder a sus consultas, comentarios o solicitudes de información.</li>
                    <li>Comunicarnos con usted en relación a sus mensajes.</li>
                </ul></p>
                <p>No compartimos su información personal con terceros, excepto en los siguientes casos:</p>
                <p><ul>
                    <li>Si es requerido por ley.</li>
                    <li>Si usted nos da su consentimiento explícito para hacerlo.</li>
                </ul></p>
                <p>La base legal para el tratamiento de sus datos es su consentimiento explícito, así como nuestro interés legítimo en responder a sus solicitudes.</p>
            </div>
            <div>
                <h2>Almacenamiento de Información</h2>
                <p>La información recopilada a través del formulario de contacto se almacena de forma segura y se mantiene confidencial. Nos esforzamos por proteger su información personal mediante la implementación de medidas de seguridad razonables.</p>
                <p>Conservaremos su información personal únicamente durante el tiempo necesario para cumplir con los fines descritos en esta política, salvo que la ley exija un período de conservación más largo.</p>
            </div>
            <div>
                <h2>Videos de YouTube</h2>
                <p>Nuestro sitio web puede incluir videos incrustados de YouTube mediante el dominio <code>youtube-nocookies.com</code>. Esto significa que YouTube no establecerá cookies hasta que el usuario interactúe con el video. Sin embargo, una vez que interactúe con el video, YouTube puede establecer cookies de terceros para analizar el uso del video y ofrecer contenido personalizado.</p>
            </div>
            <div>
                <h2>Enlaces a Sitios Web de Terceros</h2>
                <p>Nuestro sitio web puede contener enlaces a otros sitios web que no están bajo nuestro control. No somos responsables de las prácticas de privacidad ni del contenido de esos sitios web. Le recomendamos que revise las políticas de privacidad de cualquier sitio web de terceros que visite.</p>
            </div>
            <div>
                <h2>Seguridad de la Información</h2>
                <p>Nos esforzamos por proteger su información personal mediante la implementación de medidas de seguridad razonables. Sin embargo, ninguna transmisión de datos por Internet o sistema de almacenamiento puede garantizarse como 100% seguro.</p>
            </div>
            <div>
                <h2>Derechos del Usuario</h2>
                <p>De acuerdo con el RGPD, usted tiene los siguientes derechos en relación con su información personal:</p>
                <p><ul>
                    <li><strong>Acceso:</strong> Puede solicitar acceso a los datos personales que tenemos sobre usted.</li>
                    <li><strong>Rectificación:</strong> Puede solicitar la corrección de datos inexactos o incompletos.</li>
                    <li><strong>Supresión:</strong> Puede solicitar la eliminación de sus datos personales cuando ya no sean necesarios para los fines para los que fueron recopilados.</li>
                    <li><strong>Limitación del tratamiento:</strong> Puede solicitar que limitemos el tratamiento de sus datos en ciertas circunstancias.</li>
                    <li><strong>Portabilidad:</strong> Puede solicitar que le proporcionemos sus datos en un formato estructurado, de uso común y lectura mecánica.</li>
                    <li><strong>Oposición:</strong> Puede oponerse al tratamiento de sus datos personales en determinadas situaciones.</li>
                </ul></p>
                <p>Si desea ejercer estos derechos, puede contactarnos a través del correo electrónico <a href="mailto:contacto@salvadorcampello.com">contacto@salvadorcampello.com</a>.</p>
            </div>
            <div>
                <h2>Cambios en la Política de Privacidad</h2>
                <p>Podemos actualizar nuestra política de privacidad ocasionalmente. Cualquier cambio será publicado en esta página, y la fecha de la última actualización se indicará al final de esta política.</p>
            </div>
            <div>
                <h2>Contacto</h2>
                <p>Si tiene alguna pregunta o inquietud sobre nuestra política de privacidad, puede contactarnos a través de los canales disponibles en nuestro sitio web o directamente al correo electrónico <a href="mailto:contacto@salvadorcampello.com">contacto@salvadorcampello.com</a>.</p>
            </div>
            <div className='py-10'>
                <Link href={routePath('home', 'es')} className="button">Volver a Inicio</Link>
            </div>
        </section>
    )
}
