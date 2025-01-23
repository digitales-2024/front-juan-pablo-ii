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
import { ComponentPropsWithoutRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
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
import { Button } from "@/components/ui/button";
import { RefreshCcw, RefreshCcwDot } from "lucide-react";
import { useUsers } from "../_hooks/useUsers";
import { UserResponseDto } from "../types";

interface ReactivateUsersDialogProps
	extends ComponentPropsWithoutRef<typeof AlertDialog> {
	users: Row<UserResponseDto>["original"][];
	showTrigger?: boolean;
	onSuccess?: () => void;
}

export default function ReactivateUserDialog({
	users,
	showTrigger = true,
	onSuccess,
	...props
}: ReactivateUsersDialogProps) {
	const isDesktop = useMediaQuery("(min-width: 640px)");
	const { reactivateUser, isReactivating } = useUsers();

	function onReactivateUsersHandler() {
		reactivateUser(users[0].id, {
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
							<RefreshCcwDot
								className="mr-2 size-4"
								aria-hidden="true"
							/>
							Reactivar ({users.length})
						</Button>
					</AlertDialogTrigger>
				) : null}
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							¿Estás absolutamente seguro?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción reactivará a{" "}
							<span className="font-medium"> {users.length}</span>
							{users.length === 1 ? " usuario" : " usuarios"}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="gap-2 sm:space-x-0">
						<AlertDialogCancel asChild>
							<Button variant="outline">Cancelar</Button>
						</AlertDialogCancel>
						<AlertDialogAction
							aria-label="Reactivate selected rows"
							onClick={onReactivateUsersHandler}
							disabled={isReactivating}
						>
							{isReactivating && (
								<RefreshCcw
									className="mr-2 size-4 animate-spin"
									aria-hidden="true"
								/>
							)}
							Reactivar
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
						<RefreshCcwDot
							className="mr-2 size-4"
							aria-hidden="true"
						/>
						Reactivar ({users.length})
					</Button>
				</DrawerTrigger>
			) : null}
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
					<DrawerDescription>
						Esta acción reactivará a
						<span className="font-medium">{users.length}</span>
						{users.length === 1 ? " usuario" : " usuarios"}
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter className="gap-2 sm:space-x-0">
					<Button
						aria-label="Reactivate selected rows"
						onClick={onReactivateUsersHandler}
					>
						Reactivar
					</Button>
					<DrawerClose asChild>
						<Button variant="outline">Cancelar</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
