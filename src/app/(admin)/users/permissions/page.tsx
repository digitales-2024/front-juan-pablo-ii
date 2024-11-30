"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRol } from "@/hooks/use-rol";
import { Module, Permission } from "@/types";
import { extractUniquePermissionsModules } from "@/utils/extractUniquePermissionsModules";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useEffect, useState } from "react";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PagePermissions() {
    const { dataRolPermissions, isLoadingRolPermissions } = useRol();
    const [headerPermissions, setHeaderPermissions] = useState<Permission[]>();
    useEffect(() => {
        if (dataRolPermissions) {
            const uniquePermissions =
                extractUniquePermissionsModules(dataRolPermissions);
            setHeaderPermissions(uniquePermissions);
        }
    }, [dataRolPermissions]);
    const [expandedModule, setExpandedModule] = useState<string | null>(null);

    const toggleModule = (moduleName: string) => {
        setExpandedModule(expandedModule === moduleName ? null : moduleName);
    };

    const isDesktop = useMediaQuery("(min-width: 640px)");

    if (isLoadingRolPermissions) {
        return (
            <Shell>
                <HeaderPage
                    title="Permisos"
                    description="Todos los permisos de cada módulo"
                />
                <div className="flex flex-col gap-2">
                    {Array.from({ length: isDesktop ? 5 : 1 }).map(
                        (_, index) => (
                            <div
                                key={index}
                                className="flex flex-col justify-between gap-x-4 gap-y-2 sm:flex-row"
                            >
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ),
                    )}
                </div>
            </Shell>
        );
    }

    if (!dataRolPermissions || !headerPermissions) {
        return (
            <Shell>
                <HeaderPage
                    title="Permisos"
                    description="Todos los permisos de cada módulo"
                />
                <ErrorPage />
            </Shell>
        );
    }

    return (
        <Shell>
            <HeaderPage
                title="Permisos"
                description="Todos los permisos de cada módulo"
            />

            <TooltipProvider>
                <div className="hidden md:block">
                    <Table>
                        <TableCaption>
                            Todos los modulos y permisos
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="uppercase">
                                    Módulo
                                </TableHead>
                                {headerPermissions?.map((permission) => (
                                    <TableHead
                                        key={permission.id}
                                        className="uppercase"
                                    >
                                        {permission.name}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataRolPermissions?.map(
                                ({ module, permissions }) => (
                                    <TableRow key={module.id}>
                                        <TableCell className="inline-flex w-full items-center justify-between">
                                            <span className="uppercase">
                                                {module.name}
                                            </span>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="size-4 text-slate-500" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{module.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        {headerPermissions?.map(
                                            (permission) => {
                                                const hasPermission =
                                                    permissions.find(
                                                        (p) =>
                                                            p.id ===
                                                            permission.id,
                                                    );
                                                return (
                                                    <TableCell
                                                        key={permission.id}
                                                    >
                                                        {hasPermission ? (
                                                            <Badge
                                                                variant="default"
                                                                className="bg-green-500 hover:bg-green-600"
                                                            >
                                                                Si
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-gray-400"
                                                            >
                                                                No
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                );
                                            },
                                        )}
                                    </TableRow>
                                ),
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Mobile view */}
                <div className="md:hidden">
                    {dataRolPermissions?.map(
                        ({
                            module,
                            permissions,
                        }: {
                            module: Module;
                            permissions: Permission[];
                        }) => (
                            <div
                                key={module.name}
                                className="mb-4 rounded-md border"
                            >
                                <Button
                                    variant="ghost"
                                    className="inline-flex w-full justify-between p-4 text-left"
                                    onClick={() => toggleModule(module.name)}
                                >
                                    <span className="uppercase">
                                        {module.name}
                                    </span>
                                    <div className="inline-flex gap-6">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="size-4 text-slate-500" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{module.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        {expandedModule === module.name ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </div>
                                </Button>
                                {expandedModule === module.name && (
                                    <div className="p-4">
                                        {permissions.map((permission) => (
                                            <div
                                                key={permission.cod}
                                                className="mb-2 flex items-center justify-between"
                                            >
                                                <span className="capitalize">
                                                    {permission.name}
                                                </span>
                                                <Badge
                                                    variant="default"
                                                    className="bg-green-500"
                                                >
                                                    Si
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ),
                    )}
                </div>
            </TooltipProvider>
        </Shell>
    );
}
