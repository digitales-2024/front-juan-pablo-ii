import { getAllProducts } from "./actions";

export default async function Page() {

	const products = await getAllProducts();

	console.log(products)

    return (
        <div>
			{JSON.stringify(products)}
        </div>
    );
}