"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { User, UserCreateDto, userCreateSchema } from "../types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const infoSheet = {
	title: "Actualizar Usuario",
	description: "Actualiza la información del usuario y guarda los cambios",
};

interface UpdateUserSheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {
	user: User;
}

export default function UpdateUserSheet({
	user,
	...props
}: UpdateUserSheetProps) {
	const form = useForm<UserCreateDto>({
		resolver: zodResolver(userCreateSchema),
		defaultValues: {
			name: user.name ?? "",
			phone: user.phone,
			roles: user.roles.map((rol) => rol.id),
		},
	});

	useEffect(() => {
		form.reset({
			name: user.name ?? "",
			phone: user.phone,
			roles: user.roles.map((rol) => rol.id),
		});
	}, [user, form]);

	const onSubmit = async (input: UserCreateDto) => {
		// await updateUser(user.id, input);
	};

	return (
		<Sheet {...props}>
			<SheetContent
				className="flex flex-col gap-6 sm:max-w-md"
				tabIndex={undefined}
			>
				<SheetHeader className="text-left">
					<SheetTitle className="flex flex-col items-start">
						{infoSheet.title}
						<Badge
							className="bg-emerald-100 text-emerald-700"
							variant="secondary"
						>
							{user.email}
						</Badge>
					</SheetTitle>
					<SheetDescription>{infoSheet.description}</SheetDescription>
				</SheetHeader>
				<ScrollArea className="w-full gap-4 rounded-md border p-4">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-4 p-2"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input
												placeholder="john smith"
												className="resize-none"
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
										<FormLabel>Teléfono</FormLabel>
										<FormControl>
											<Input
												placeholder="985523221"
												className="resize-none"
												{...field}
											/>
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
											disabled={user.isSuperAdmin}
										>
											<FormControl>
												<SelectTrigger className="capitalize">
													<SelectValue placeholder="Selecciona un rol" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													{/* {dataRoles?.map((rol) => (
														<SelectItem
															key={rol.id}
															value={rol.id}
															className="capitalize"
														>
															{rol.name}
														</SelectItem>
													))} */}
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<SheetFooter className="gap-2 pt-2 sm:space-x-0">
								<div className="flex flex-row-reverse flex-wrap gap-2">
									{/* <Button disabled={isLoadingUpdateUser}>
										{isLoadingUpdateUser && (
											<RefreshCcw
												className="mr-2 size-4 animate-spin"
												aria-hidden="true"
											/>
										)} */}
									Actualizar
									{/* </Button> */}
									<SheetClose asChild>
										<Button type="button" variant="outline">
											Cancelar
										</Button>
									</SheetClose>
								</div>
							</SheetFooter>
						</form>
					</Form>
					<Separator className="my-6" />
					{/* <SendNewPasswordForm user={user} /> */}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
