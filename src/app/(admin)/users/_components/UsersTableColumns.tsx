import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "../types";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Ellipsis, RefreshCcwDot, Squircle, Trash } from "lucide-react";
import { useState } from "react";
import UpdateUserSheet from "./UpdateUserSheet";
import DeleteUserDialog from "./DeleteUserDialog";
import ReactivateUserDialog from "./ReactivateUserDialog";
import { Button } from "@/components/ui/button";

export const usersTableColumns = (): ColumnDef<User>[] => [
	{
		id: "Nombre",
		accessorKey: "name",
		header: "Nombre",
	},
	{
		id: "Email",
		accessorKey: "email",
		header: "Email",
	},
	{
		id: "Última conexión",
		accessorKey: "lastLogin",
		header: "Última conexión",
	},
	{
		id: "rol",
		accessorKey: "roles",
		accessorFn: (row) => row.roles.map((role) => role.name).join(", "),
		enableGlobalFilter: true,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Rol" />
		),
		cell: ({ row }) => (
			<div className="inline-flex items-center gap-2 capitalize">
				<Squircle
					className="size-4 fill-primary stroke-none"
					aria-hidden="true"
				/>
				{row.original.roles[0].name}
			</div>
		),
	},
	{
		id: "Acciones",
		accessorKey: "actions",
		size: 10,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Acciones" />
		),
		cell: function Cell({ row }) {
			const [showDeleteDialog, setShowDeleteDialog] = useState(false);
			const [showReactivateDialog, setShowReactivateDialog] =
				useState(false);
			const [showEditDialog, setShowEditDialog] = useState(false);

			const { isActive } = row.original;
			const isSuperAdmin = true;
			return (
				<div>
					<div>
						<UpdateUserSheet
							open={showEditDialog}
							onOpenChange={setShowEditDialog}
							user={row?.original}
						/>
						<DeleteUserDialog
							open={showDeleteDialog}
							onOpenChange={setShowDeleteDialog}
							users={[row?.original]}
							showTrigger={false}
							onSuccess={() => {
								row.toggleSelected(false);
							}}
						/>
						<ReactivateUserDialog
							open={showReactivateDialog}
							onOpenChange={setShowReactivateDialog}
							users={[row?.original]}
							showTrigger={false}
							onSuccess={() => {
								row.toggleSelected(false);
							}}
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								aria-label="Open menu"
								variant="ghost"
								className="flex size-8 p-0 data-[state=open]:bg-muted"
							>
								<Ellipsis
									className="size-4"
									aria-hidden="true"
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem
								onSelect={() => setShowEditDialog(true)}
								disabled={!isActive}
							>
								Editar
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							{isSuperAdmin && (
								<DropdownMenuItem
									onSelect={() =>
										setShowReactivateDialog(true)
									}
									disabled={isActive}
								>
									Reactivar
									<DropdownMenuShortcut>
										<RefreshCcwDot
											className="size-4"
											aria-hidden="true"
										/>
									</DropdownMenuShortcut>
								</DropdownMenuItem>
							)}
							<DropdownMenuItem
								onSelect={() => setShowDeleteDialog(true)}
								disabled={!isActive}
							>
								Eliminar
								<DropdownMenuShortcut>
									<Trash
										className="size-4"
										aria-hidden="true"
									/>
								</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
		enablePinning: true,
	},
];
