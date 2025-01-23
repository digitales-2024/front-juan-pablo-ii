"use client";

import { useProfile } from "@/hooks/use-profile";
import { ProjectCharter } from "@/types";
import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { exportTableToCSV } from "@/lib/export";

import { DeleteAllObservationsDialog } from "./DeleteAllObservationsDialog";

export interface ProjectCharterTableToolbarActionsProps {
    table?: Table<ProjectCharter>;
    exportFile?: boolean;
}

export function ProjectCharterTableToolbarActions({
    table,
    exportFile = false,
}: ProjectCharterTableToolbarActionsProps) {
    const { user } = useProfile();
    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteAllObservationsDialog
                        projectCharter={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => {
                            table.toggleAllRowsSelected(false);
                        }}
                    />
                </>
            ) : null}
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
