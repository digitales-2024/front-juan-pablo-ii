"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { UserCreateDto } from "../types";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getRoles } from "../../roles/actionst";
import { RoleResponseDto } from "../../roles/types";
import { generatePassword } from "../utils";

interface CreateUsersFormProps
	extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
	children: React.ReactNode;
	form: UseFormReturn<UserCreateDto>;
	onSubmit: (data: UserCreateDto) => void;
}

export default function CreateUserForm({
	children,
	form,
	onSubmit,
}: CreateUsersFormProps) {
	const handleGeneratePassword = () => {
		form.setValue("password", generatePassword());
	};

	const [isPending, startTransition] = useTransition();
	const [roles, setRoles] = useState<RoleResponseDto[]>([]);
	useEffect(() => {
		startTransition(async () => {
			const roles = await getRoles();
			setRoles(roles);
		});
	}, []);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="flex flex-col gap-6 p-4 sm:p-0">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="name">
									Nombre completo
								</FormLabel>
								<FormControl>
									<Input id="name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="email">Email</FormLabel>
								<FormControl>
									<Input
										id="email"
										placeholder="usuario@dominio.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="phone">Teléfono</FormLabel>
								<FormControl>
									<Input id="phone" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="password">
									Generar contraseña
								</FormLabel>
								<FormControl>
									<div className="flex items-center gap-2">
										<Input id="password" {...field} />
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														type="button"
														variant="outline"
														onClick={
															handleGeneratePassword
														}
													>
														<Bot
															className="size-4"
															aria-hidden="true"
														/>
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													Generar constraseña
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="roles"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="rol">Rol</FormLabel>
								<Select
									onValueChange={(value) =>
										field.onChange([value])
									}
									defaultValue={field.value[0] || ""}
									disabled={isPending}
								>
									<FormControl>
										<SelectTrigger className="capitalize">
											<SelectValue placeholder="Selecciona un rol" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											{roles?.map((rol) => (
												<SelectItem
													key={rol.id}
													value={rol.id}
													className="capitalize"
												>
													{rol.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				{children}
			</form>
		</Form>
	);
}
