import { LucideIcon } from "lucide-react";

export type DataDependency = {
    dependencyName: string;
    dependencyUrl?: string;
}
/**
 * Represents metadata for a web page. En Next no es necesario usar Helmet.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { Helmet } from 'react-helmet';
 *
 * interface PageMetadataProps {
 *   title: string;
 *   description: string;
 *   canonicalUrl: string;
 * }
 *
 * const PageMetadata: React.FC<PageMetadataProps> = ({ title, description, canonicalUrl }) => {
 *   return (
 *     <Helmet>
 *       <title>{title}</title>
 *       <meta name="description" content={description} />
 *       <link rel="canonical" href={canonicalUrl} />
 *     </Helmet>
 *   );
 * };
 * ```
 *
 * @property {string} title - The title of the page.
 * @property {string} description - The description of the page.
 * @property {object} [dataDependencies] - The data dependencies of the page. Data  that is necessary to crete new registers.
 * @property {string[]} [keywords] - The keywords associated with the page.
 * @property {string} [author] - The author of the page.
 * @property {string} [canonicalUrl] - The canonical URL of the page.
 * @property {string} [ogTitle] - The Open Graph title of the page.
 * @property {string} [ogDescription] - The Open Graph description of the page.
 * @property {string} [ogImage] - The Open Graph image of the page.
 * @property {string} [ogUrl] - The Open Graph URL of the page.
 * @property {string} [robots] - The robots meta tag for the page.
 * @property {ReactNode} [Icon] - The React component for the page icon.
 * 
 * * @property title - El título principal de la página (se muestra en la pestaña del navegador).
 * @property description - La descripción breve de la página (utilizada por motores de búsqueda y redes sociales).
 * @property dataDependencies - Lista de dependencias de datos necesarias para la creación de nuevos registros.
 * @property keywords - Lista de palabras clave relevantes al contenido, útiles para SEO.
 * @property author - El nombre del autor o responsable del contenido.
 * @property canonicalUrl - Enlace canónico que indica la URL principal o preferida de la página.
 * @property ogTitle - Título específico para cuando se comparte el enlace en redes sociales (Open Graph).
 * @property ogDescription - Descripción específica para la vista previa en redes sociales (Open Graph).
 * @property ogImage - URL de la imagen para la vista previa en redes sociales (Open Graph).
 * @property ogUrl - URL canónica para la vista previa en redes sociales (Open Graph).
 * @property robots - Instrucciones para motores de búsqueda sobre la indexación y seguimiento de enlaces.
 * @property Icon - Componente React para el ícono de la página.
 */
export type PageMetadata = {
    title: string;
    description: string;
    entityName: string;
    entityPluralName: string;
    dataDependencies?: DataDependency[];
    keywords?: string[];
    author?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    robots?: string;
    Icon?: LucideIcon; // CONFIGURE ACCORDING TO THE TYPE OF ICON COMPONENT
};