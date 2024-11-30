"use client";

import { useProfile } from "@/hooks/use-profile";
import { Client } from "@/types";
import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { exportTableToCSV } from "@/lib/export";

import { CreateClientDialog } from "./CreateClientDialog";
import { DeleteClientsDialog } from "./DeleteClientDialog";
import { ReactivateClientsDialog } from "./ReactivateClientsDialog";

export interface ClientsTableToolbarActionsProps {
    table?: Table<Client>;
    exportFile?: boolean;
}

export function ClientTableToolbarActions({
    table,
    exportFile = false,
}: ClientsTableToolbarActionsProps) {
    const { user } = useProfile();
    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteClientsDialog
                        clients={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    {user?.isSuperAdmin && (
                        <ReactivateClientsDialog
                            clients={table
                                .getFilteredSelectedRowModel()
                                .rows.map((row) => row.original)}
                            onSuccess={() => table.toggleAllRowsSelected(false)}
                        />
                    )}
                </>
            ) : null}
            <CreateClientDialog />
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
