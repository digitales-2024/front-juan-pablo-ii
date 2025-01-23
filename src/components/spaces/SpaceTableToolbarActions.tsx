"use client";

import { useProfile } from "@/hooks/use-profile";
import { Spaces } from "@/types";
import { type Table } from "@tanstack/react-table";

import { CreateSpaceDialog } from "./CreateSpaceDialog";
import { DeleteSpacesDialog } from "./DeleteSpacesDialog";
import { ReactivateSpacessDialog } from "./ReactivateSpacesDialog";

export interface SpacesTableToolbarActionsProps {
    table?: Table<Spaces>;
    exportFile?: boolean;
}

export function SpaceTableToolbarActions({
    table,
}: SpacesTableToolbarActionsProps) {
    const { user } = useProfile();
    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteSpacesDialog
                        spaces={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    {user?.isSuperAdmin && (
                        <ReactivateSpacessDialog
                            spaces={table
                                .getFilteredSelectedRowModel()
                                .rows.map((row) => row.original)}
                            onSuccess={() => table.toggleAllRowsSelected(false)}
                        />
                    )}
                </>
            ) : null}
            <CreateSpaceDialog />
        </div>
    );
}
