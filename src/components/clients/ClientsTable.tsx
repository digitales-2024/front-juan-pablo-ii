"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { ClientWithDescription } from "@/types";
import { useMemo } from "react";

import { DataTableExpanded } from "../data-table/DataTableExpanded";
import { ClientDescription } from "./ClientsDescription";
import { ClientTableToolbarActions } from "./ClientsTableToolbarActions";
import { clientsColumns } from "./ClientTableColumns";

export function ClientsTable({ data }: { data: ClientWithDescription[] }) {
    const { user } = useProfile();

    const columns = useMemo(
        () => clientsColumns(user?.isSuperAdmin || false),
        [user],
    );

    return (
        <DataTableExpanded
            data={data}
            columns={columns}
            getSubRows={(row) =>
                row.description as unknown as ClientWithDescription[]
            }
            toolbarActions={<ClientTableToolbarActions />}
            placeholder="Buscar clientes..."
            renderExpandedRow={(row) => <ClientDescription row={row} />}
        />
    );
}
