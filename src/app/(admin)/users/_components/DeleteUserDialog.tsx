import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { ComponentPropsWithoutRef } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Row } from "@tanstack/react-table";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Trash } from "lucide-react";
import { useUsers } from "../_hooks/useUsers";
import { UserResponseDto } from "../types";

interface DeleteUsersDialogProps
	extends ComponentPropsWithoutRef<typeof AlertDialog> {
	users: Row<UserResponseDto>["original"][];
	showTrigger?: boolean;
	onSuccess?: () => void;
}

export default function DeleteUserDialog({
	users,
	showTrigger = true,
	onSuccess,
	...props
}: DeleteUsersDialogProps) {
	const isDesktop = useMediaQuery("(min-width: 640px)");

	const { deleteUser, isDeleting } = useUsers();

	function onDeleteUsersHandler() {
		deleteUser(users[0].id, {
			onSuccess: () => {
				onSuccess?.();
			},
		});
	}

	if (isDesktop) {
		return (
			<AlertDialog {...props}>
				{showTrigger ? (
					<AlertDialogTrigger asChild>
						<Button variant="outline" size="sm">
							<Trash className="mr-2 size-4" aria-hidden="true" />
							Eliminar ({users.length})
						</Button>
					</AlertDialogTrigger>
				) : null}
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							¿Estás absolutamente seguro?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción eliminará a
							<span className="font-medium"> {users.length}</span>
							{users.length === 1 ? " usuario" : " usuarios"}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="gap-2 sm:space-x-0">
						<AlertDialogCancel asChild>
							<Button variant="outline">Cancelar</Button>
						</AlertDialogCancel>
						<AlertDialogAction
							aria-label="Delete selected rows"
							onClick={onDeleteUsersHandler}
							disabled={isDeleting}
						>
							{isDeleting && (
								<RefreshCcw
									className="mr-2 size-4 animate-spin"
									aria-hidden="true"
								/>
							)}
							Eliminar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}

	return (
		<Drawer {...props}>
			{showTrigger ? (
				<DrawerTrigger asChild>
					<Button variant="outline" size="sm">
						<Trash className="mr-2 size-4" aria-hidden="true" />
						Eliminar ({users.length})
					</Button>
				</DrawerTrigger>
			) : null}
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
					<DrawerDescription>
						Esta acción eliminará a
						<span className="font-medium">{users.length}</span>
						{users.length === 1 ? " usuario" : " usuarios"}
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter className="gap-2 sm:space-x-0">
					<Button
						aria-label="Delete selected rows"
						onClick={onDeleteUsersHandler}
						disabled={isDeleting}
					>
						{isDeleting && (
							<RefreshCcw
								className="mr-2 size-4 animate-spin"
								aria-hidden="true"
							/>
						)}
						Eliminar
					</Button>
					<DrawerClose asChild>
						<Button variant="outline">Cancelar</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
