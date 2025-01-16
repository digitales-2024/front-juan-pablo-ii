"use client";
import { DataTable } from "@/components/data-table/DataTable";
import { useEffect, useMemo } from "react";
import { Product } from "../types";
import { productColumns } from "./ProductTableColumns";
import { ProductTableToolbarActions } from "./ProductTableToolbarActions";
import { Profile } from "@/app/(account)/type";
import { useProfileStore } from "@/app/hooks/use-profile";


interface ProductTableProps {
	data: Product[];
	profile: Profile;
}

const ProductTable: React.FC<ProductTableProps> = ({ data, profile }) => {

	const columns = useMemo(
		() => productColumns(profile.isSuperAdmin,
			
		),
		[profile]
	);
	const { setProfile } = useProfileStore();

	useEffect(() => {
		setProfile(profile);
	}, [profile]);


	return (
		<DataTable
			data={data}
			columns={columns}
			toolbarActions={<ProductTableToolbarActions />}
			placeholder="Buscar producto..."
		/>
	);
};

export default ProductTable;
