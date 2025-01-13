"use client";

import { Product } from "../types";
import { type Table } from "@tanstack/react-table";

import { CreateProductDialog } from "./CreateCategoryDialog";
import { DeleteProductsDialog } from "./DeleteCategoryDialog";
import { ReactivateProductsDialog } from "./ReactivateCategoryDialog";
import { useProfileStore } from "@/app/hooks/use-profile";
export interface ProductTableToolbarActionsProps {
	table?: Table<Product>;
	exportFile?: boolean;
}

export function ProductTableToolbarActions({
	table,
}: ProductTableToolbarActionsProps) {
	const { profile } = useProfileStore();
	return (
		<div className="flex w-fit flex-wrap items-center gap-2">
			{table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
				<>
					<DeleteProductsDialog
						products={table
							.getFilteredSelectedRowModel()
							.rows.map((row) => row.original)}
						onSuccess={() => table.toggleAllRowsSelected(false)}
					/>
					{profile?.isSuperAdmin && (
						<ReactivateProductsDialog
							products={table
								.getFilteredSelectedRowModel()
								.rows.map((row) => row.original)}
							onSuccess={() => table.toggleAllRowsSelected(false)}
						/>
					)}
				</>
			) : null}
			<CreateProductDialog />
		</div>
	);
}
