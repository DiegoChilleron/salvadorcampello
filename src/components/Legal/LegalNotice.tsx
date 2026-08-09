import { Link } from '@/i18n/navigation';
import { routePath } from '@/config/routes';

export const LegalNotice = () => {
    return (
        <section className="legal-container">
            <h1>Aviso Legal</h1>
            <div>
                <h2>Titularidad del Sitio Web</h2>
                <p>En cumplimiento con la Ley de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI) y demás normativa aplicable, se informa a los usuarios del sitio web <a href="https://salvadorcampello.com">https://salvadorcampello.com</a> que los datos del titular son los siguientes:</p>
                <p><ul>
                    <li><strong>Titular:</strong> Salvador Campello</li>
                    <li><strong>Domicilio:</strong> Elche (Alicante), España</li>
                    <li><strong>Correo electrónico:</strong> <a href="mailto:contacto@salvadorcampello.com">contacto@salvadorcampello.com</a></li>
                </ul></p>
            </div>
            <div>
                <h2>Propiedad Intelectual</h2>
                <p>Todos los contenidos del sitio web, incluyendo, sin carácter limitativo, los textos, gráficos, imágenes, diseño y derechos de propiedad intelectual que pudieran corresponder a dichos contenidos, así como todas las marcas, nombres comerciales o cualquier otro signo distintivo, son propiedad del titular del sitio web o de sus legítimos propietarios, quedando reservados todos los derechos sobre los mismos.</p>
                <p>Queda estrictamente prohibida cualquier modalidad de explotación, incluyendo la reproducción, distribución, comunicación pública y transformación, sin la autorización expresa y por escrito del titular del sitio web. Asimismo, se prohíbe la publicación de los contenidos del sitio web en otras páginas web, redes sociales o cualquier otro medio sin dicha autorización.</p>
            </div>
            <div>
                <h2>Responsabilidad sobre los Contenidos</h2>
                <p>El titular del sitio web no se hace responsable de la legalidad de otros sitios web de terceros desde los que pueda accederse al portal. Tampoco se asume responsabilidad por la legalidad de otros sitios web de terceros que pudieran estar vinculados o enlazados desde este portal.</p>
                <p>El titular del sitio web se reserva el derecho a realizar cambios en el sitio web sin previo aviso, con el objeto de actualizar, corregir, modificar, añadir o eliminar los contenidos del sitio web o su diseño. Los contenidos y servicios que ofrece el portal se actualizan periódicamente. No obstante, no se garantiza la disponibilidad o continuidad del acceso a los mismos.</p>
            </div>
            <div>
                <h2>Protección de Datos Personales</h2>
                <p>El acceso al sitio web o su uso no implica una recogida de datos personales del usuario por parte del titular del sitio web. En caso de que se recopilen datos personales, el usuario será debidamente informado conforme a lo establecido en el Reglamento General de Protección de Datos (RGPD) y demás normativa aplicable en materia de protección de datos.</p>
                <p>Los datos personales que se recopilen, en su caso, serán tratados de manera confidencial y únicamente para los fines específicos para los que se hayan proporcionado, de acuerdo con los principios de licitud, lealtad, transparencia, limitación de la finalidad, minimización de datos, exactitud, integridad y confidencialidad establecidos en el RGPD.</p>
                <p>El usuario tiene derecho a acceder, rectificar, suprimir, limitar el tratamiento, oponerse y portar sus datos personales, así como a presentar una reclamación ante la autoridad de control competente, en caso de considerar que sus derechos han sido vulnerados.</p>
            </div>
            <div>
                <h2>Cookies</h2>
                <p>Este sitio web no utiliza cookies propias ni de terceros de manera general. Sin embargo, los videos de YouTube incrustados en el sitio web pueden establecer cookies de terceros una vez que interactúe con ellos, como al reproducirlos. Estas cookies son gestionadas directamente por YouTube y están sujetas a sus propias políticas de privacidad. Para más información, consulte nuestra <Link href={routePath('cookiesPolicy', 'es')}>Política de Cookies</Link>.</p>
            </div>
            <div>
                <h2>Ley Aplicable y Jurisdicción</h2>
                <p>El presente Aviso Legal se rige en todos y cada uno de sus extremos por la legislación española y europea aplicable. Para la resolución de cualquier conflicto que pudiera derivarse del acceso al sitio web, el usuario y el titular del sitio web acuerdan someterse expresamente a los juzgados y tribunales de la ciudad de Elche (Alicante), con renuncia a cualquier otro fuero general o especial que les pudiera corresponder.</p>
            </div>
            <div>
                <h2>Contacto</h2>
                <p>En caso de que cualquier usuario tuviera alguna duda acerca de estas condiciones legales o cualquier comentario sobre el portal <a href="https://salvadorcampello.com">https://salvadorcampello.com</a>, puede dirigirse a <a href="mailto:contacto@salvadorcampello.com">contacto@salvadorcampello.com</a>.</p>
            </div>
            <div className='py-10'>
                <Link href={routePath('home', 'es')} className="button">Volver a Inicio</Link>
            </div>
        </section>
    )
}
