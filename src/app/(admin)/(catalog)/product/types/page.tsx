import { getAllCategories } from "./actions";
import CategoryTable from "./_components/TypeTable";
import { Category } from "./types";
import { getProfile } from "@/app/(account)/actions";

/**
 * Página que muestra una lista de categorías registradas en el sistema.
 *
 * Esta página utiliza la función `getAllCategories` para obtener todas las categorías
 * y `getProfile` para obtener el perfil del usuario actual.
 *
 * Devuelve un JSX que contiene una tabla con las categorías y un shell que contiene
 * una barra de navegación y un pie de página.
 */
export default async function Page() {
  const categories: Category[] = await getAllCategories();
  const profile = await getProfile();

  return (
<>
      {/* Encabezado */}
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Categorías
          </h2>
          <p className="text-muted-foreground">
            Lista de categorías registradas en el sistema.
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <CategoryTable data={categories} profile={profile} />
      </div>
      </>
  );
}
