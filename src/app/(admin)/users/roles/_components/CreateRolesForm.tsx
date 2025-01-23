"use client";
import { useRol } from "@/hooks/use-rol";
import { CreateRolesSchema } from "@/schemas";
import { ChevronDown, ChevronUp, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

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
import { Switch } from "@/components/ui/switch";

import { cn } from "@/lib/utils";

interface CreateRolesFormProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    children: React.ReactNode;
    form: UseFormReturn<CreateRolesSchema>;
    onSubmit: (data: CreateRolesSchema) => void;
}

export const CreateRolesForm = ({
    children,
    form,
    onSubmit,
}: CreateRolesFormProps) => {
    const { dataRolPermissions } = useRol();
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

    const { setValue, clearErrors } = form;

    useEffect(() => {
        setValue("rolPermissions", selectedPermissions);
        clearErrors("rolPermissions");
    }, [selectedPermissions, clearErrors, setValue]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col gap-6 p-4 sm:p-0">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name">Nombre</FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        placeholder="Ejemplo: admin"
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
                                <FormLabel htmlFor="description">
                                    Descripción
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="description"
                                        placeholder="Ejemplo: se encarga de administrar el sistema"
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
                    <ScrollArea className="h-[35vh] py-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {dataRolPermissions?.map(
                                ({ module, permissions }) => (
                                    <Card
                                        key={module.id}
                                        className={cn("flex flex-col gap-4", {
                                            "border-emerald-500":
                                                selectedPermissions.some((p) =>
                                                    permissions.some(
                                                        (perm) =>
                                                            perm.idModulePermission ===
                                                            p,
                                                    ),
                                                ),
                                        })}
                                    >
                                        <div
                                            className="flex cursor-pointer items-center justify-between p-4"
                                            onClick={() =>
                                                toggleModule(module.name)
                                            }
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">
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
                                                            key={permission.id}
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
                                                                    size={10}
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
                                                                {
                                                                    permission.name
                                                                }
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
                    </ScrollArea>
                </div>
                {children}
            </form>
        </Form>
    );
};
