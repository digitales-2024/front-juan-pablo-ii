"use client";

import { TypeProduct } from "../types";
import { type Table } from "@tanstack/react-table";

import { CreateTypeDialog } from "./CreateTypeDialog";
import { DeleteTypeDialog } from "./DeleteTypeDialog";
import { ReactivateTypeDialog } from "./ReactivateTypeDialog";
import { useProfileStore } from "@/app/hooks/use-profile";

export interface TypeTableToolbarActionsProps {
    table?: Table<TypeProduct>;
    exportFile?: boolean;
}

export function TypeTableToolbarActions({
    table,
}: TypeTableToolbarActionsProps) {
    const { profile } = useProfileStore();
    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteTypeDialog
                        types={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    {profile?.isSuperAdmin && (
                        <ReactivateTypeDialog
                            types={table
                                .getFilteredSelectedRowModel()
                                .rows.map((row) => row.original)}
                            onSuccess={() => table.toggleAllRowsSelected(false)}
                        />
                    )}
                </>
            ) : null}
            <CreateTypeDialog />
        </div>
    );
}