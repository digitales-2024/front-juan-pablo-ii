import { getAllProducts } from "./actions";
import ProductTable from "./_components/ProductTable";
import { Shell } from "@/components/common/Shell";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Product } from "./types";

export default async function Page() {
    let products: Product[] = [];

    try {
        products = await getAllProducts();
    } catch (error) {
        console.error("Error fetching products:", error);
        // Puedes mostrar un mensaje de error en la UI si lo deseas
    }

    return (
        <div>
            <Shell className="gap-6">
                <HeaderPage
                    title="Productos"
                    description="Lista de productos registrados en el sistema."
                />
                <ProductTable data={products} />
            </Shell>
        </div>
    );
}