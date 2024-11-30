"use client";

import { useRol } from "@/hooks/use-rol";
import {
    updateRolesSchema,
    UpdateRolesSchema,
} from "@/schemas/users/rolesSchema";
import { Role } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Circle, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

const infoSheet = {
    title: "Actualizar Rol",
    description: "Actualiza la información del rol y guarda los cambios",
};

interface UpdateRoleSheetProps
    extends React.ComponentPropsWithRef<typeof Sheet> {
    rol: Role;
}
export type UpdateRoleSchema = UpdateRolesSchema & { id?: string };

export function UpdateRoleSheet({ rol, ...props }: UpdateRoleSheetProps) {
    const {
        dataRolPermissions,
        onUpdateRole,
        isSuccessUpdateRole,
        isLoadingUpdateRole,
    } = useRol();

    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        [],
    );
    const toggleModule = (moduleName: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleName)
                ? prev.filter((m) => m !== moduleName)
                : [...prev, moduleName],
        );
    };

    const handlePermissionChange = (permission: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((p) => p !== permission)
                : [...prev, permission],
        );
    };

    const idsModulesPermissions: string[] =
        rol.rolPermissions &&
        rol.rolPermissions.flatMap((rolPerm) =>
            rolPerm.permissions
                .map((permission) => permission.idModulePermission)
                .filter((id): id is string => id !== undefined),
        );

    const form = useForm<UpdateRoleSchema>({
        resolver: zodResolver(updateRolesSchema),
        defaultValues: {
            name: rol.name ?? "",
            description: rol.description ?? "",
            rolPermissions: idsModulesPermissions ?? [],
        },
    });

    useEffect(() => {
        if (rol) {
            setSelectedPermissions(idsModulesPermissions ?? []);
        }
        /* eslint react-hooks/exhaustive-deps: "off" */
    }, [rol, setSelectedPermissions]);

    useEffect(() => {
        form.reset({
            name: rol.name ?? "",
            description: rol.description ?? "",
        });
    }, [rol, form]);

    function onSubmit(input: UpdateRolesSchema) {
        onUpdateRole({
            id: rol.id,
            name: input?.name ?? "",
            description: input?.description ?? "",
            rolPermissions: input?.rolPermissions ?? [],
        });
    }

    useEffect(() => {
        if (isSuccessUpdateRole) {
            form.reset();
            props.onOpenChange?.(false);
        }
    }, [isSuccessUpdateRole]);

    const { setValue, clearErrors } = form;
    useEffect(() => {
        setValue("rolPermissions", selectedPermissions);
        clearErrors("rolPermissions");
    }, [selectedPermissions]);

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
                            className="bg-emerald-100 capitalize text-emerald-700"
                            variant="secondary"
                        >
                            {rol.name}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>{infoSheet.description}</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <ScrollArea className="w-full gap-4 rounded-md border p-4">
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descripción</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <h3 className="text-lg font-semibold">
                                Módulos y Permisos
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {dataRolPermissions?.map(
                                    ({ module, permissions }) => (
                                        <Card
                                            key={module.id}
                                            className={cn(
                                                "flex flex-col gap-4",
                                                {
                                                    "border-emerald-500":
                                                        selectedPermissions.some(
                                                            (p) =>
                                                                permissions.some(
                                                                    (perm) =>
                                                                        perm.idModulePermission ===
                                                                        p,
                                                                ),
                                                        ),
                                                },
                                            )}
                                        >
                                            <div
                                                className="flex cursor-pointer items-center justify-between p-4"
                                                onClick={() =>
                                                    toggleModule(module.name)
                                                }
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <span className="truncate font-medium">
                                                        {module.name}
                                                    </span>
                                                </div>
                                                {expandedModules.includes(
                                                    module.name,
                                                ) ? (
                                                    <ChevronUp className="h-5 w-5" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5" />
                                                )}
                                            </div>
                                            {expandedModules.includes(
                                                module.name,
                                            ) && (
                                                <div className="space-y-2 px-4 pb-4 pt-2">
                                                    {permissions.map(
                                                        (permission) => (
                                                            <div
                                                                key={
                                                                    permission.id
                                                                }
                                                                className="flex items-center justify-between space-x-2"
                                                            >
                                                                <Label
                                                                    htmlFor={`permission-${module.name}-${permission.name}`}
                                                                    className={cn(
                                                                        "inline-flex items-center gap-2 text-sm capitalize",
                                                                        {
                                                                            "text-emerald-500":
                                                                                selectedPermissions.includes(
                                                                                    `${permission.idModulePermission}`,
                                                                                ),
                                                                        },
                                                                    )}
                                                                >
                                                                    <Circle
                                                                        size={
                                                                            10
                                                                        }
                                                                        className={cn(
                                                                            "fill-slate-300 stroke-none",
                                                                            {
                                                                                "fill-emerald-500":
                                                                                    selectedPermissions.includes(
                                                                                        `${permission.idModulePermission}`,
                                                                                    ),
                                                                            },
                                                                        )}
                                                                    />
                                                                    <span className="truncate">
                                                                        {
                                                                            permission.name
                                                                        }
                                                                    </span>
                                                                </Label>
                                                                <Switch
                                                                    id={`permission-${permission.idModulePermission}`}
                                                                    checked={selectedPermissions.includes(
                                                                        `${permission.idModulePermission}`,
                                                                    )}
                                                                    className=""
                                                                    onCheckedChange={() =>
                                                                        handlePermissionChange(
                                                                            `${permission.idModulePermission}`,
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </Card>
                                    ),
                                )}
                            </div>
                            <SheetFooter className="flexgap-2 pt-2 sm:space-x-0">
                                <div className="flex flex-row-reverse flex-wrap gap-2">
                                    <Button disabled={isLoadingUpdateRole}>
                                        {isLoadingUpdateRole && (
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
                    </ScrollArea>
                </Form>{" "}
            </SheetContent>
        </Sheet>
    );
}
