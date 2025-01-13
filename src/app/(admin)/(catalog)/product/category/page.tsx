import { getAllProducts } from "./actions";
import ProductTable from "./_components/CategoryTable";
import { Shell } from "@/components/common/Shell";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Product } from "./types";
import { getProfile } from "@/app/(account)/actions";

export default async function Page() {
	const products: Product[] = await getAllProducts();
	const profile = await getProfile();

	return (
		<div>
			<Shell className="gap-6">
				<HeaderPage
					title="Productos"
					description="Lista de productos registrados en el sistema."
				/>
				<ProductTable data={products} profile={profile} />
			</Shell>
		</div>
	);
}
