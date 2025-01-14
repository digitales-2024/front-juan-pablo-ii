import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { UserCreateDto, userCreateSchema } from "../types";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import CreateUserForm from "./CreateUserForm";
import { createUser } from "../actions";

const dataForm = {
	button: "Crear usuario",
	title: "Registrar nuevo usuario",
	description:
		"Rellena los campos para crear un nuevo usuario y enviar sus credenciales por correo",
};
export default function CreateUserDialog() {
	const [open, setOpen] = useState(false);
	const [isCreatePending, startCreateTransition] = useTransition();
	const isDesktop = useMediaQuery("(min-width: 640px)");

	const form = useForm<UserCreateDto>({
		resolver: zodResolver(userCreateSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			password: "",
			roles: [],
		},
	});

	const onSubmit = async (input: UserCreateDto) => {
		startCreateTransition(async () => {
			await createUser(input);
		});
	};

	const handleClose = () => {
		form.reset();
	};

	if (isDesktop)
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="outline" size="sm">
						<Plus className="mr-2 size-4" aria-hidden="true" />
						{dataForm.button}
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{dataForm.title}</DialogTitle>
						<DialogDescription>
							{dataForm.description}
						</DialogDescription>
					</DialogHeader>
					<CreateUserForm form={form} onSubmit={onSubmit}>
						<DialogFooter className="gap-2 sm:space-x-0 flex sm:flex-row-reverse">
							<Button
								disabled={isCreatePending}
								className="w-full"
							>
								{isCreatePending && (
									<RefreshCcw
										className="mr-2 size-4 animate-spin"
										aria-hidden="true"
									/>
								)}
								Registrar y enviar correo
							</Button>
							<DialogClose asChild>
								<Button
									onClick={handleClose}
									type="button"
									variant="outline"
									className="w-full"
								>
									Cancelar
								</Button>
							</DialogClose>
						</DialogFooter>
					</CreateUserForm>
				</DialogContent>
			</Dialog>
		);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" size="sm">
					<Plus className="mr-2 size-4" aria-hidden="true" />
					{dataForm.button}
				</Button>
			</DrawerTrigger>

			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{dataForm.title}</DrawerTitle>
					<DrawerDescription>
						{dataForm.description}
					</DrawerDescription>
				</DrawerHeader>
				<CreateUserForm form={form} onSubmit={onSubmit}>
					<DrawerFooter className="gap-2 sm:space-x-0 flex flex-row-reverse">
						<Button disabled={isCreatePending}>
							{isCreatePending && (
								<RefreshCcw
									className="mr-2 size-4 animate-spin"
									aria-hidden="true"
								/>
							)}
							Registrar y enviar correo
						</Button>
						<DrawerClose asChild>
							<Button variant="outline">Cancelar</Button>
						</DrawerClose>
					</DrawerFooter>
				</CreateUserForm>
			</DrawerContent>
		</Drawer>
	);
}
