"use client";

import { useProfile } from "@/hooks/use-profile";
import { Role } from "@/types";
import { type Table } from "@tanstack/react-table";

import { CreateRolesDialog } from "./CreateRolesDialog";
import { DeleteRolesDialog } from "./DeleteRolesDialog";
import { ReactivateRolesDialog } from "./ReactivateRolesDialog";

export interface RolesTableToolbarActionsProps {
    table?: Table<Role>;
}

export function RolesTableToolbarActions({
    table,
}: RolesTableToolbarActionsProps) {
    const { user } = useProfile();

    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteRolesDialog
                        roles={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    {user?.isSuperAdmin && (
                        <ReactivateRolesDialog
                            roles={table
                                .getFilteredSelectedRowModel()
                                .rows.map((row) => row.original)}
                            onSuccess={() => table.toggleAllRowsSelected(false)}
                        />
                    )}
                </>
            ) : null}
            <CreateRolesDialog />
        </div>
    );
}
