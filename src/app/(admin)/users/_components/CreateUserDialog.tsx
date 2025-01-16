"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCreateDto, userCreateSchema } from "../types";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateUserForm from "./CreateUserForm";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { createUser } from "../actions";

const CREATE_USER_MESSAGES = {
	button: "Crear usuario",
	title: "Registrar nuevo usuario",
	description:
		"Rellena los campos para crear un nuevo usuario y enviar sus credenciales por correo",
	success: "Usuario creado exitosamente",
	submitButton: "Registrar y enviar correo",
	cancel: "Cancelar",
} as const;

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

	async function handleSubmit(input: UserCreateDto) {
		startCreateTransition(async () => {
			await createUser(input);
			setOpen(false);
			toast.success(CREATE_USER_MESSAGES.success);
		});
	}

	const handleClose = () => {
		form.reset();
		setOpen(false);
	};

	const DialogFooterContent = () => (
		<div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse">
			<Button type="submit" disabled={isCreatePending} className="w-full">
				{isCreatePending && (
					<RefreshCcw
						className="mr-2 size-4 animate-spin"
						aria-hidden="true"
					/>
				)}
				{CREATE_USER_MESSAGES.submitButton}
			</Button>
			<Button
				type="button"
				variant="outline"
				className="w-full"
				onClick={handleClose}
			>
				{CREATE_USER_MESSAGES.cancel}
			</Button>
		</div>
	);

	const TriggerButton = () => (
		<Button onClick={() => setOpen(true)} variant="outline" size="sm">
			<Plus className="size-4" aria-hidden="true" />
			{CREATE_USER_MESSAGES.button}
		</Button>
	);

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<TriggerButton />
				</DialogTrigger>
				<DialogContent tabIndex={undefined}>
					<DialogHeader>
						<DialogTitle>{CREATE_USER_MESSAGES.title}</DialogTitle>
						<DialogDescription>
							{CREATE_USER_MESSAGES.description}
						</DialogDescription>
					</DialogHeader>
					<CreateUserForm form={form} onSubmit={handleSubmit}>
						<DialogFooter>
							<DialogFooterContent />
						</DialogFooter>
					</CreateUserForm>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<TriggerButton />
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{CREATE_USER_MESSAGES.title}</DrawerTitle>
					<DrawerDescription>
						{CREATE_USER_MESSAGES.description}
					</DrawerDescription>
				</DrawerHeader>
				<CreateUserForm form={form} onSubmit={handleSubmit}>
					<DrawerFooter>
						<DialogFooterContent />
					</DrawerFooter>
				</CreateUserForm>
			</DrawerContent>
		</Drawer>
	);
}
