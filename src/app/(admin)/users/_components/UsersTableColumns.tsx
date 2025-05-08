import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Ellipsis, RefreshCcwDot, Squircle, Trash } from "lucide-react";
import { useState } from "react";
import UpdateUserSheet from "./UpdateUserSheet";
import DeleteUserDialog from "./DeleteUserDialog";
import ReactivateUserDialog from "./ReactivateUserDialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UserResponseDto } from "../types";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const usersTableColumns = (): ColumnDef<UserResponseDto>[] => [
	{
		id: "select",
		size: 10,
		header: ({ table }) => (
		  <div className="px-2">
			<Checkbox
			  checked={
				table.getIsAllPageRowsSelected() ||
				(table.getIsSomePageRowsSelected() && "indeterminate")
			  }
			  onCheckedChange={(value) =>
				table.toggleAllPageRowsSelected(!!value)
			  }
			  aria-label="Select all"
			  className="translate-y-0.5"
			/>
		  </div>
		),
		cell: ({ row }) => (
		  <div className="px-2">
			<Checkbox
			  checked={row.getIsSelected()}
			  onCheckedChange={(value) => row.toggleSelected(!!value)}
			  aria-label="Select row"
			  className="translate-y-0.5"
			/>
		  </div>
		),
		enableSorting: false,
		enableHiding: false,
		enablePinning: true,
	  },
  
	{
		id: "nombre",
		accessorKey: "name",
		accessorFn: (row) => row.name,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Nombre" />
		),
		cell: ({ row }) => (
			<span className="capitalize"> {row.original.name}</span>
		),
	},
	{
		id: "Email",
		accessorKey: "email",
		accessorFn: (row) => row.email,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Email" />
		),
		cell: ({ row }) => <div>{row.original.email}</div>,
	},
	{
		id: "Teléfono",
		accessorKey: "phone",
		accessorFn: (row) => row.phone,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Teléfono" />
		),
		cell: ({ row }) => (
			<div>
				{row.original.phone
					? formatPhoneNumberIntl(row.original.phone)
					: "No disponible"}
			</div>
		),
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
		id: "Estado",
		accessorKey: "isActive",
		accessorFn: (row) => row.isActive,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Estado" />
		),
		cell: ({ row }) => (
			<div>
				{row.original.isActive ? (
					<Badge variant="success">Activo</Badge>
				) : (
					<Badge variant="destructive">Inactivo</Badge>
				)}
			</div>
		),
	},
	{
		id: "Última conexión",
		accessorKey: "lastLogin",
		header: "Última conexión",
		cell: ({ row }) => (
			<div>
				{row.original.lastLogin
					? format(new Date(row.original.lastLogin), "PPPp", {
							locale: es,
					  })
					: "No disponible"}
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
								Desactivar
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
