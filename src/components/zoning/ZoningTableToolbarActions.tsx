"use client";

import { useProfile } from "@/hooks/use-profile";
import { Zoning } from "@/types";
import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { exportTableToCSV } from "@/lib/export";

import { CreateZoningDialog } from "./CreateZoningDialog";
import { DeleteZoningDialog } from "./DeleteZoningDialog";
import { ReactivateZoningDialog } from "./ReactivateZoningDialog";

export interface ZoningTableToolbarActionsProps {
    table?: Table<Zoning>;
    exportFile?: boolean;
}

export function ZoningTableToolbarActions({
    table,
    exportFile = false,
}: ZoningTableToolbarActionsProps) {
    const { user } = useProfile();
    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteZoningDialog
                        zoning={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    {user?.isSuperAdmin && (
                        <ReactivateZoningDialog
                            zoning={table
                                .getFilteredSelectedRowModel()
                                .rows.map((row) => row.original)}
                            onSuccess={() => table.toggleAllRowsSelected(false)}
                        />
                    )}
                </>
            ) : null}
            <CreateZoningDialog />
            {exportFile ||
                (user?.isSuperAdmin && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (table) {
                                exportTableToCSV(table, {
                                    filename: "products",
                                    excludeColumns: ["select", "actions"],
                                });
                            }
                        }}
                    >
                        <Download className="mr-2 size-4" aria-hidden="true" />
                        Exportar
                    </Button>
                ))}
        </div>
    );
}
