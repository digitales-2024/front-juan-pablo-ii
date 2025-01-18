import { Table } from "@tanstack/react-table";
import { User } from "../types";
import DeleteUserDialog from "./DeleteUserDialog";
import ReactivateUserDialog from "./ReactivateUserDialog";
import CreateUserDialog from "./CreateUserDialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportTableToCSV } from "@/lib/export";

export interface UsersTableToolbarActionsProps {
	table?: Table<User>;
}

export default function UsersTableToolbarActions({
	table,
}: UsersTableToolbarActionsProps) {
	return (
		<div className="flex flex-wrap items-center justify-end gap-2">
			{table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
				<>
					<DeleteUserDialog
						users={table
							.getFilteredSelectedRowModel()
							.rows.map((row) => row.original)}
						onSuccess={() => table.toggleAllRowsSelected(false)}
					/>
					<ReactivateUserDialog
						users={table
							.getFilteredSelectedRowModel()
							.rows.map((row) => row.original)}
						onSuccess={() => table.toggleAllRowsSelected(false)}
					/>
				</>
			) : null}
			<CreateUserDialog />
			{/* {user?.isSuperAdmin && (
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						if (table) {
							exportTableToCSV(table, {
								filename: "users",
								excludeColumns: ["select", "actions"],
							});
						}
					}}
				>
					<Download className="mr-2 size-4" aria-hidden="true" />
					Exportar
				</Button>
			)} */}
		</div>
	);
}
