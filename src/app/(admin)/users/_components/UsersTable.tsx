"use client";
import { DataTable } from "@/components/data-table/DataTable";
import { User } from "../types";
import { useMemo } from "react";
import { usersTableColumns } from "./UsersTableColumns";
import UsersTableToolbarActions from "./UsersTableToolbarActions";

interface TData {
	data: User[];
}
export function UsersTable({ data }: TData) {
	const columns = useMemo(() => usersTableColumns(), []);

	return (
		<DataTable
			data={data}
			columns={columns}
			toolbarActions={<UsersTableToolbarActions />}
		/>
	);
}
