import { getAllTypeProducts } from "./actions";
import TypeTable from "./_components/TypeTable";
import { TypeProduct } from "./types";
import { getProfile } from "@/app/(account)/actions";

/**
 * Página que muestra una lista de tipos de productos registrados en el sistema.
 *
 * Esta página utiliza la función `getAllTypeProducts` para obtener todos los tipos de productos
 * y `getProfile` para obtener el perfil del usuario actual.
 *
 * Devuelve un JSX que contiene una tabla con los tipos de productos y un shell que contiene
 * una barra de navegación y un pie de página.
 */
export default async function Page() {
  const typeProducts: TypeProduct[] = await getAllTypeProducts();
  const profile = await getProfile();

  return (
    <>
      {/* Encabezado */}
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Tipos de Productos
          </h2>
          <p className="text-muted-foreground">
            Lista de tipos de productos registrados en el sistema.
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <TypeTable data={typeProducts} profile={profile} />
      </div>
    </>
  );
}