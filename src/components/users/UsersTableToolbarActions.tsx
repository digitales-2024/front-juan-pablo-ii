"use client";

import { User } from "@/types";
import { type Table } from "@tanstack/react-table";

import { CreateUsersDialog } from "./CreateUserDialog";
import { DeleteUsersDialog } from "./DeleteUsersDialog";
import { ReactivateUsersDialog } from "./ReactivateUsersDialog";

export interface UsersTableToolbarActionsProps {
    table?: Table<User>;
}

export function UsersTableToolbarActions({
    table,
}: UsersTableToolbarActionsProps) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteUsersDialog
                        users={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    <ReactivateUsersDialog
                        users={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                </>
            ) : null}
            <CreateUsersDialog />
        </div>
    );
}
