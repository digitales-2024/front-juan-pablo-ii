import { useRol } from "@/hooks/use-rol";
import { useUsers } from "@/hooks/use-users";
import { CreateUsersSchema, usersSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, RefreshCcw } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

export function CreateUsersDialog() {
    const { dataRoles } = useRol();
    const [open, setOpen] = useState(false);
    const [isCreatePending, startCreateTransition] = useTransition();
    const { onCreateUser, isSuccessCreateUser } = useUsers();

    const form = useForm<CreateUsersSchema>({
        resolver: zodResolver(usersSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            roles: [],
        },
    });

    const { handleGeneratePassword, password } = useUsers();
    const { setValue, clearErrors } = form;

    useEffect(() => {
        if (password) {
            setValue("password", password?.password);
            clearErrors("password");
        }
    }, [password, setValue, clearErrors]);

    const onSubmit = async (input: CreateUsersSchema) => {
        startCreateTransition(async () => {
            await onCreateUser(input);
        });
    };

    useEffect(() => {
        if (isSuccessCreateUser) {
            form.reset();
            setOpen(false);
        }
    }, [isSuccessCreateUser, form]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Crear usuario</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear un usuario nuevo</DialogTitle>
                    <DialogDescription>
                        Complete la información y presione el boton Crear.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre Completo</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ejm: Juan Perez"
                                            {...field}
                                        />
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
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="usuario@trazoarq.com"
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
                                            placeholder="Ejemplo: 999 888 777"
                                            {...field}
                                        />
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
                                            <Input
                                                id="password"
                                                placeholder="********"
                                                {...field}
                                            />
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
                                        defaultValue={field?.value?.[0] ?? ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="capitalize">
                                                <SelectValue placeholder="Selecciona un rol" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {dataRoles?.map((rol) => (
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
                        <Button disabled={isCreatePending} className="w-full">
                            {isCreatePending && (
                                <RefreshCcw
                                    className="mr-2 size-4 animate-spin"
                                    aria-hidden="true"
                                />
                            )}
                            Registrar y enviar correo
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
