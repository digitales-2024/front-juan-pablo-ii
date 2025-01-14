"use client";

import { Category } from "../types";
import { type Table } from "@tanstack/react-table";

import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { ReactivateCategoryDialog } from "./ReactivateCategoryDialog";
import { useProfileStore } from "@/app/hooks/use-profile";

export interface CategoryTableToolbarActionsProps {
    table?: Table<Category>;
    exportFile?: boolean;
}

export function CategoryTableToolbarActions({
    table,
}: CategoryTableToolbarActionsProps) {
    const { profile } = useProfileStore();
    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteCategoryDialog
                        categories={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    {profile?.isSuperAdmin && (
                        <ReactivateCategoryDialog
                            categories={table
                                .getFilteredSelectedRowModel()
                                .rows.map((row) => row.original)}
                            onSuccess={() => table.toggleAllRowsSelected(false)}
                        />
                    )}
                </>
            ) : null}
            <CreateCategoryDialog />
        </div>
    );
}