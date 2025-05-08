"use client";
import { DataTable } from "@/components/data-table/DataTable";
import { useMemo } from "react";
import { usersTableColumns } from "./UsersTableColumns";
import UsersTableToolbarActions from "./UsersTableToolbarActions";
import { UserResponseDto } from "../types";

interface TData {
	data: UserResponseDto[];
}
export function UsersTable({ data }: TData) {
	const columns = useMemo(() => usersTableColumns(), []);

	return (
		<DataTable
			data={data || []}
			columns={columns}
		    toolbarActions={(table) => <UsersTableToolbarActions table={table} />}
		/>
	);
}
