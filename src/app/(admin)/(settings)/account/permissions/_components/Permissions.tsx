'use client';

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useProfile } from "../../_hooks/useProfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Permission {
  id: string;
  cod: string;
  name: string;
  description: string;
}

interface Module {
  id: string;
  cod: string;
  name: string;
  description: string;
}

interface RolPermission {
  module: Module;
  permissions: Permission[];
}

interface PermissionResponse {
  id: string;
  name: string;
  description: string;
  rolPermissions: RolPermission[];
}

export const Permissions = () => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const { permissions } = useProfile();

  const toggleModule = (moduleName: string) => {
    setExpandedModule(expandedModule === moduleName ? null : moduleName);
  };

  if (!permissions) {
    return <div>Cargando permisos...</div>;
  }

  const permissionsData = permissions as unknown as PermissionResponse;

  // Obtener tipos únicos de permisos basados en el primer módulo
  const uniquePermissionTypes = permissionsData.rolPermissions[0]?.permissions.map(
    (perm: Permission) => ({
      cod: perm.cod,
      name: perm.name
    })
  ) || [];

  return (
    <div className="w-full">
      {/* Vista Desktop */}
      <div className="hidden md:block">
        <ScrollArea className="h-fit rounded-md border">
          <Table>
            <TableCaption>Permisos del Rol: {permissionsData.name}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="uppercase">Módulo</TableHead>
                {uniquePermissionTypes.map((type: { cod: string; name: string }) => (
                  <TableHead key={type.cod} className="uppercase">
                    {type.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionsData.rolPermissions.map((rolPermission: RolPermission) => (
                <TableRow key={rolPermission.module.id}>
                  <TableCell className="font-medium uppercase">
                    {rolPermission.module.name}
                  </TableCell>
                  {uniquePermissionTypes.map((type: { cod: string; name: string }) => (
                    <TableCell key={type.cod}>
                      {rolPermission.permissions.some(
                        (perm: Permission) => perm.cod === type.cod
                      ) ? (
                        <Badge
                          variant="default"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          ✓
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-400">
                          -
                        </Badge>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Vista Mobile */}
      <div className="md:hidden">
        {permissionsData.rolPermissions.map((rolPermission) => (
          <div key={rolPermission.module.id} className="mb-4 rounded-md border">
            <Button
              variant="ghost"
              className="w-full justify-between p-4 text-left"
              onClick={() => toggleModule(rolPermission.module.name)}
            >
              <div>
                <span className="uppercase">{rolPermission.module.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({rolPermission.module.cod})
                </span>
              </div>
              {expandedModule === rolPermission.module.name ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {expandedModule === rolPermission.module.name && (
              <div className="p-4">
                {rolPermission.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="mb-2 flex items-center justify-between"
                  >
                    <div>
                      <span className="capitalize">{permission.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({permission.cod})
                      </span>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      ✓
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};