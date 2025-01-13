"use client";

import { useProfile } from "@/app/(account)/use-profile";
import { Product } from "../types";
import { type Table } from "@tanstack/react-table";

import { CreateProductDialog } from "./CreateProductDialog";
import { DeleteProductsDialog } from "./DeleteProductsDialog";
import { ReactivateProductsDialog } from "./ReactivateProductsDialog";
export interface ProductTableToolbarActionsProps {
    table?: Table<Product>;
    exportFile?: boolean;
}

export function ProductTableToolbarActions({
    table,
}: ProductTableToolbarActionsProps) {
    const { user } = useProfile();
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
                    {user?.isSuperAdmin && (
                        <ReactivateProductsDialog
                            products={table
                                .getFilteredSelectedRowModel()
                                .rows.map((row) => row.original)}
                            onSuccess={() => table.toggleAllRowsSelected(false)}
                        />
                    )}
                </>
            ) : null}
            hasdhvasdjhfvjkhjhkasdfhasdfkh
            <CreateProductDialog />
        </div>
    );
}