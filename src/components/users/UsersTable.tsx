"use client";

import { useProfile } from "@/hooks/use-profile";
import { User } from "@/types";
import { useMemo } from "react";

import { DataTable } from "../data-table/DataTable";
import { usersColumns } from "./UsersTableColumns";
import { UsersTableToolbarActions } from "./UsersTableToolbarActions";

export function UsersTable({ data }: { data: User[] }) {
    const { user } = useProfile();
    const columns = useMemo(
        () => usersColumns(user?.isSuperAdmin || false),
        [user],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<UsersTableToolbarActions />}
            placeholder="Buscar usuarios..."
        />
    );
}
