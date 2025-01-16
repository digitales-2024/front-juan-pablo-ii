/**
 * Componente que se muestra mientras se carga la lista de categorías.
 *
 * Devuelve un JSX que contiene un texto que indica que se está cargando.
 */
export default function Loading() {
    return (
        <div className="flex h-full items-center justify-center">
            <p className="text-lg font-bold">Cargando...</p>
        </div>
    );
}
