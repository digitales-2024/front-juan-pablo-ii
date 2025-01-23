import { getAllProducts } from "./actions";
import ProductTable from "./_components/ProductTable";
import { Product } from "./types";
import { getProfile } from "@/app/(account)/actions";

export default async function Page() {
  const products: Product[] = await getAllProducts();
  const profile = await getProfile();

  return (
    <>
      {/* Encabezado */}
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Productos</h2>
          <p className="text-muted-foreground">
            Lista de productos registrados en el sistema.
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ProductTable data={products} profile={profile} />
      </div>
    </>
  );
}
