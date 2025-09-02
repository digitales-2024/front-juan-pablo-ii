# 👤 Módulo de Usuarios (Users) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Usuarios** gestiona toda la información relacionada con los usuarios del sistema de la clínica Juan Pablo II. Permite registrar, actualizar, desactivar y reactivar usuarios, así como administrar sus roles y permisos dentro del sistema.

## 📁 Estructura del Módulo

```
users/
├── _components/
│   ├── CreateUserDialog.tsx           # Diálogo de creación de usuarios
│   ├── CreateUserForm.tsx             # Formulario de creación
│   ├── DeleteUserDialog.tsx           # Diálogo de eliminación
│   ├── ReactivateUserDialog.tsx       # Diálogo de reactivación
│   ├── SendNewPasswordForm.tsx        # Formulario para enviar nueva contraseña
│   ├── UpdateUserSheet.tsx            # Sheet de actualización
│   ├── UsersTable.tsx                 # Tabla principal de usuarios
│   ├── UsersTableColumns.tsx          # Definición de columnas
│   └── UsersTableToolbarActions.tsx   # Acciones de la toolbar
├── _hooks/
│   └── useUsers.ts                    # Hook principal del módulo
├── actions.ts                         # Server Actions
├── error.tsx                          # Página de error
├── loading.tsx                        # Página de carga
├── page.tsx                           # Página principal
├── types.ts                           # Tipos TypeScript
├── utils.ts                           # Utilidades del módulo
└── README.md                          # Esta documentación
```

## 🔧 Interfaces y Tipos

### **Tipos Principales**

```typescript
// Tipos base de la API
export type RolResponseDto = components["schemas"]["RolResponseDto"];
export type UserResponseDto = Omit<
    components["schemas"]["UserResponseDto"],
    "roles"
> & {
    roles: RolResponseDto[];
};
export type UserCreateDto = components["schemas"]["CreateUserDto"];
export type UserUpdateDto = components["schemas"]["UpdateUserDto"];
export type SendEmailDto = components["schemas"]["SendEmailDto"];

// Tipos personalizados
export type SendNewPasswordDto = z.infer<typeof sendNewPasswordSchema>;

// Interfaz para variables de actualización
interface UpdateUserVariables {
    id: string;
    data: UserUpdateDto;
}
```

### **Schemas de Validación**

```typescript
// Schema para crear usuario
export const userCreateSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    email: z.string().min(1, { message: "El email es requerido" }),
    password: z.string().min(1, { message: "La contraseña es requerida" }),
    phone: z
        .string()
        .min(1, { message: "El telefono es requerido" })
        .optional(),
    roles: z.array(z.string()).min(1, { message: "El rol es requerido" }),
}) satisfies z.ZodType<UserCreateDto>;

// Schema para actualizar usuario
export const userUpdateSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    phone: z
        .string()
        .min(1, { message: "El telefono es requerido" })
        .optional(),
    roles: z.array(z.string()).min(1, { message: "El rol es requerido" }),
}) satisfies z.ZodType<UserUpdateDto>;

// Schema para enviar nueva contraseña
export const sendNewPasswordSchema = z.object({
    password: z
        .string()
        .min(6, { message: "La contraseña es requerida" })
});
```

## 🎣 Hooks del Módulo

### **useUsers Hook**

```typescript
export const useUsers = () => {
    const queryClient = useQueryClient();

    // Mutación para crear usuario
    const createMutation = useMutation<
        BaseApiResponse<UserResponseDto>,
        Error,
        UserCreateDto
    >({
        mutationFn: async (data) => {
            const response = await createUser(data);
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: (res) => {
            // Actualizar la caché de usuarios
            queryClient.setQueryData<UserResponseDto[]>(
                ["users"],
                (oldUsers) => {
                    if (!oldUsers) return [res.data];
                    return [...oldUsers, res.data];
                }
            );
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Mutación para actualizar usuario
    const updateMutation = useMutation<
        BaseApiResponse<UserResponseDto>,
        Error,
        UpdateUserVariables
    >({
        mutationFn: async ({ id, data }) => {
            const response = await updateUser(id, data);
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: (res) => {
            // Actualizar la caché de usuarios
            queryClient.setQueryData<UserResponseDto[]>(
                ["users"],
                (oldUsers) => {
                    if (!oldUsers) return [res.data];
                    return oldUsers.map((user) => {
                        if (user.id === res.data.id) {
                            return res.data;
                        } else {
                            return user;
                        }
                    });
                }
            );
            toast.success("Usuario actualizado exitosamente");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Mutación para enviar nueva contraseña
    const sendNewPasswordMutation = useMutation<
        { error?: string },
        Error,
        SendEmailDto
    >({
        mutationFn: async (data) => {
            const response = await sendNewPassword(data);
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: () => {
            toast.success("Nueva contraseña actualizada exitosamente");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Mutación para eliminar usuario
    const deleteUserMutation = useMutation<BaseApiResponse, Error, string>({
        mutationFn: async (id) => {
            const response = await deleteUser(id);
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Mutación para reactivar usuario
    const reactivateUserMutation = useMutation<BaseApiResponse, Error, string>({
        mutationFn: async (id) => {
            const response = await reactivateUser(id);
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return {
        // Mutations
        createUser: createMutation.mutate,
        isCreating: createMutation.isPending,
        createError: createMutation.error,
        updateUser: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,
        sendNewPassword: sendNewPasswordMutation.mutate,
        isLoadingSendNewPassword: sendNewPasswordMutation.isPending,
        isSuccessSendNewPassword: sendNewPasswordMutation.isSuccess,
        sendNewPasswordError: sendNewPasswordMutation.error,
        deleteUser: deleteUserMutation.mutate,
        isDeleting: deleteUserMutation.isPending,
        deleteError: deleteUserMutation.error,
        reactivateUser: reactivateUserMutation.mutate,
        isReactivating: reactivateUserMutation.isPending,
        reactivateError: reactivateUserMutation.error,
    };
};
```

## 🚀 Server Actions

### **Users Actions**

```typescript
// Obtener usuarios
export async function getUsers(): Promise<GetUsersResponse> {
    try {
        const [users, error] = await http.get<UserResponseDto[]>("/users");

        if (error) {
            return { error: error.message };
        }
        return users;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

// Crear usuario
export async function createUser(
    data: UserCreateDto
): Promise<CreateUserResponse> {
    try {
        const [user, error] = await http.post<BaseApiResponse>("/users", data);

        if (error) {
            return { error: error.message };
        }
        
        // Invalidar la caché para que getUsers() se vuelva a ejecutar
        revalidatePath('/users');
        return user;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

// Actualizar usuario
export async function updateUser(
    id: string,
    data: UserUpdateDto
): Promise<CreateUserResponse> {
    try {
        const [user, error] = await http.patch<BaseApiResponse>(
            `/users/${id}`,
            data
        );

        if (error) {
            return { error: error.message };
        }

        // Invalidar la caché para que getUsers() se vuelva a ejecutar
        revalidatePath('/users');
        return user;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

// Eliminar usuario
export async function deleteUser(id: string): Promise<DeleteUserResponse> {
    try {
        const [response, error] = await http.delete<BaseApiResponse>(
            `/users/${id}`
        );

        if (error) {
            return { error: error.message };
        }

        // Invalidar la caché para que getUsers() se vuelva a ejecutar
        revalidatePath('/users');
        return response;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

// Reactivar usuario
export async function reactivateUser(id: string): Promise<DeleteUserResponse> {
    try {
        const [response, error] = await http.patch<BaseApiResponse>(
            `/users/reactivate/${id}`
        );

        if (error) {
            return { error: error.message };
        }

        // Invalidar la caché para que getUsers() se vuelva a ejecutar
        revalidatePath('/users');
        return response;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

// Enviar nueva contraseña
export async function sendNewPassword(
    data: SendEmailDto
): Promise<{ error?: string }> {
    try {
        const [, error] = await http.post(`/users/send-new-password`, data);

        if (error) {
            return { error: error.message };
        }

        return {};
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}
```

## 🎨 Componentes del Módulo

### **UsersTable Component**

```typescript
interface TData {
    data: UserResponseDto[];
}

export function UsersTable({ data }: TData) {
    const columns = useMemo(() => usersTableColumns(), []);

    return (
        <DataTable
            data={data || []}
            columns={columns}
            toolbarActions={(table) => <UsersTableToolbarActions table={table} />}
        />
    );
}
```

### **UsersTableColumns Component**

```typescript
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
            const [showReactivateDialog, setShowReactivateDialog] = useState(false);
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
                                <Ellipsis className="size-4" aria-hidden="true" />
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
                                    onSelect={() => setShowReactivateDialog(true)}
                                    disabled={isActive}
                                >
                                    Reactivar
                                    <DropdownMenuShortcut>
                                        <RefreshCcwDot className="size-4" aria-hidden="true" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onSelect={() => setShowDeleteDialog(true)}
                                disabled={!isActive}
                            >
                                Desactivar
                                <DropdownMenuShortcut>
                                    <Trash className="size-4" aria-hidden="true" />
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
```

### **CreateUserForm Component**

```typescript
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

    const { data, isLoading } = useRoles();
    const [showSuperAdminWarning, setShowSuperAdminWarning] = useState(false);
    const [pendingRoleSelection, setPendingRoleSelection] = useState<string | null>(null);

    const roles = data && !("error" in data) ? data : [];

    const handleRoleSelection = (value: string) => {
        const selectedRole = roles.find((rol) => rol.id === value);

        if (selectedRole && selectedRole.name === "SUPER_ADMIN") {
            setPendingRoleSelection(value);
            setShowSuperAdminWarning(true);
        } else {
            form.setValue("roles", [value]);
        }
    };

    const confirmSuperAdminSelection = () => {
        if (pendingRoleSelection) {
            form.setValue("roles", [pendingRoleSelection]);
        }
        setShowSuperAdminWarning(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col gap-6 p-4 sm:p-0">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name">Nombre completo</FormLabel>
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
                                        placeholder="usuario@juanpabloii.com"
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
                                    <PhoneInput defaultCountry="PE" id="phone" {...field} />
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
                                <FormLabel htmlFor="password">Generar contraseña</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <Input id="password" {...field} />
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={handleGeneratePassword}
                                                    >
                                                        <Bot className="size-4" aria-hidden="true" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Generar constraseña</TooltipContent>
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
                                    onValueChange={handleRoleSelection}
                                    defaultValue={field.value[0] || ""}
                                    disabled={isLoading}
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

                <Dialog
                    open={showSuperAdminWarning}
                    onOpenChange={setShowSuperAdminWarning}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Advertencia: Rol Super Administrador
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Crear otro usuario con Rol de SUPER_ADMIN queda bajo su
                            completa responsabilidad. Este rol tiene acceso total al sistema.
                        </DialogDescription>
                        <DialogFooter>
                            <Button onClick={confirmSuperAdminSelection}>
                                Entiendo y deseo continuar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {children}
            </form>
        </Form>
    );
}
```

### **UpdateUserSheet Component**

```typescript
interface UpdateUserSheetProps
    extends React.ComponentPropsWithRef<typeof Sheet> {
    user: UserResponseDto;
}

export default function UpdateUserSheet({
    user,
    ...props
}: UpdateUserSheetProps) {
    const { updateUser, isUpdating } = useUsers();
    const { data: roles } = useRoles();

    const form = useForm<UserUpdateDto>({
        resolver: zodResolver(userUpdateSchema),
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

    function onSubmit(input: UserUpdateDto) {
        updateUser(
            { id: user.id, data: input },
            {
                onSuccess: () => {
                    props.onOpenChange?.(false);
                },
            }
        );
    }

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
                                            <Input className="resize-none" {...field} />
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
                                            <PhoneInput className="resize-none" {...field} />
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
                                            onValueChange={(value) => field.onChange([value])}
                                            defaultValue={field.value?.[0] ?? ""}
                                            disabled={user.isSuperAdmin}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="capitalize">
                                                    <SelectValue placeholder="Selecciona un rol" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {Array.isArray(roles) &&
                                                        roles.map((rol) => (
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

                            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                                <div className="flex flex-row-reverse flex-wrap gap-2">
                                    <Button disabled={isUpdating}>
                                        {isUpdating && (
                                            <RefreshCcw
                                                className="mr-2 size-4 animate-spin"
                                                aria-hidden="true"
                                            />
                                        )}
                                        Actualizar
                                    </Button>
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
                    <SendNewPasswordForm user={user} />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
```

## 🔧 Utilidades del Módulo

### **generatePassword Function**

```typescript
import generator from "generate-password-ts";

/**
 * Generates a random password with the following characteristics:
 * - Length: 10
 * - Contains numbers
 * - Contains uppercase letters
 * @returns {string}
 */
export const generatePassword = (): string => {
    const maxAttempts = 10;
    let password: string;
    let attempts = 0;

    do {
        password = generator.generate({
            length: 10,
            numbers: true,
            uppercase: true,
        });
        attempts++;
    } while (!/\d/.test(password) && attempts < maxAttempts);

    if (!/\d/.test(password)) {
        throw new Error(
            "Failed to generate a valid password after maximum attempts"
        );
    }

    return password;
};
```

## 🔄 Guías de Implementación

### **Cómo Agregar un Nuevo Campo al Usuario**

1. **Actualizar la interfaz** en `types.ts`:
```typescript
export type UserCreateDto = components["schemas"]["CreateUserDto"] & {
    newField?: string; // ← Agregar aquí
};
```

2. **Actualizar el schema** de validación:
```typescript
export const userCreateSchema = z.object({
    // ... campos existentes
    newField: z.string().optional(), // ← Agregar aquí
});
```

3. **Actualizar el formulario** en `_components/CreateUserForm.tsx`:
```typescript
<FormField
    control={form.control}
    name="newField"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Nuevo Campo</FormLabel>
            <FormControl>
                <Input placeholder="Valor del nuevo campo" {...field} />
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
/>
```

4. **Actualizar la tabla** en `_components/UsersTableColumns.tsx`:
```typescript
{
    id: "Nuevo Campo",
    accessorKey: "newField",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nuevo Campo" />
    ),
    cell: ({ row }) => <div>{row.original.newField || "No disponible"}</div>,
},
```

### **Cómo Agregar un Nuevo Rol**

1. **Actualizar el hook** para obtener roles:
```typescript
// En _hooks/useUsers.ts
const { data: roles } = useRoles();
```

2. **Actualizar el formulario** para mostrar el nuevo rol:
```typescript
// En CreateUserForm.tsx y UpdateUserSheet.tsx
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
```

### **Cómo Agregar Validaciones Personalizadas**

1. **Crear validación personalizada** en el schema:
```typescript
export const userCreateSchema = z.object({
    email: z.string()
        .min(1, { message: "El email es requerido" })
        .email({ message: "Email inválido" })
        .refine((email) => email.endsWith('@juanpabloii.com'), {
            message: "El email debe ser del dominio juanpabloii.com"
        }),
    // ... otros campos
});
```

2. **Agregar validación asíncrona** (si es necesario):
```typescript
export const userCreateSchema = z.object({
    email: z.string()
        .min(1, { message: "El email es requerido" })
        .refine(async (email) => {
            // Verificar si el email ya existe
            const exists = await checkEmailExists(email);
            return !exists;
        }, {
            message: "El email ya está registrado"
        }),
    // ... otros campos
});
```

## 🧪 Testing del Módulo

### **Casos de Prueba Recomendados**

1. **Creación de usuarios**
   - Crear usuario con todos los campos requeridos
   - Crear usuario con campos opcionales
   - Validar errores con campos faltantes
   - Validar formato de email único
   - Validar generación de contraseña

2. **Actualización de usuarios**
   - Actualizar campos individuales
   - Validar que el email siga siendo único
   - Verificar historial de cambios
   - Validar restricciones de roles

3. **Eliminación y reactivación**
   - Desactivar usuario (soft delete)
   - Reactivar usuario desactivado
   - Validar permisos de super admin

4. **Gestión de contraseñas**
   - Generar contraseña automática
   - Enviar nueva contraseña por email
   - Validar formato de contraseña

5. **Roles y permisos**
   - Asignar diferentes roles
   - Validar advertencia de SUPER_ADMIN
   - Verificar restricciones de permisos

6. **Búsqueda y filtros**
   - Buscar por nombre
   - Buscar por email
   - Filtrar por estado (activo/inactivo)
   - Filtrar por rol

## 📈 Métricas y Monitoreo

### **Métricas Importantes**

- **Total de usuarios registrados**
- **Usuarios activos vs inactivos**
- **Distribución por roles**
- **Tasa de creación de usuarios**
- **Frecuencia de cambios de contraseña**
- **Última conexión de usuarios**

### **Logs Recomendados**

```typescript
// En las server actions
console.log(`👤 [USER] Creando usuario con email: ${data.email}`);
console.log(`👤 [USER] Actualizando usuario ID: ${id}`);
console.log(`👤 [USER] Desactivando usuario ID: ${id}`);
console.log(`👤 [USER] Reactivando usuario ID: ${id}`);
console.log(`👤 [USER] Enviando nueva contraseña a: ${data.email}`);
```

## 🔒 Seguridad y Permisos

### **Validaciones de Seguridad**

1. **Verificar permisos** antes de cada operación
2. **Validar propiedad** de los datos (si aplica)
3. **Auditoría** de todas las operaciones críticas
4. **Rate limiting** para prevenir spam
5. **Validación de email único**
6. **Protección contra creación de múltiples SUPER_ADMIN**

### **Permisos Requeridos**

- `users:read` - Ver usuarios
- `users:create` - Crear usuarios
- `users:update` - Actualizar usuarios
- `users:delete` - Eliminar usuarios
- `users:reactivate` - Reactivar usuarios
- `users:send-password` - Enviar nueva contraseña

### **Protección de Datos Personales**

1. **Encriptación** de contraseñas
2. **Acceso limitado** a información personal
3. **Logs de auditoría** para acceso a datos
4. **Cumplimiento** con leyes de protección de datos
5. **Consentimiento** del usuario para uso de datos
6. **Notificaciones** por email para cambios críticos

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
