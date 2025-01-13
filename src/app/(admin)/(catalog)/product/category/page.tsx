import { getAllCategories } from "./actions";
import CategoryTable from "./_components/CategoryTable";
import { Shell } from "@/components/common/Shell";
import { HeaderPage } from "@/components/common/HeaderPage";
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
        <div>
            <Shell className="gap-6">
                <HeaderPage
                    title="Categorías"
                    description="Lista de categorías registradas en el sistema."
                />
                <CategoryTable data={categories} profile={profile} />
            </Shell>
        </div>
    );
}