import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PopoverProps } from "@radix-ui/react-popover";
import React from "react";
import { toast } from "sonner";

interface StorageMovementDetailProps extends PopoverProps{
    storageId: string;
}
export function StorageMovementDetail({storageId, ...rest}: StorageMovementDetailProps) {
    const { useOneStorageQuery } = useStorages();
    const oneStorageQuery = useOneStorageQuery(storageId);

    if (oneStorageQuery.isLoading) {
        return <Button variant={"outline"} disabled>Cargando...</Button>;
    }
    if (oneStorageQuery.isError) {
        toast.error("Error al cargar el almacén, "+oneStorageQuery.error.message);
        return <Button variant={"outline"} disabled>Error</Button>;
    }
    if (oneStorageQuery.data?.length==0) {
        return <Button variant={"outline"} disabled>Sin datos</Button>;
    }

    if (!oneStorageQuery.data) {
        return <Button variant={"outline"} disabled>Error</Button>;
    }
  return (
    // Todo: Falta modificar la relacion con la sede 
    <Popover {...rest}>
      <PopoverTrigger className={cn(buttonVariants({
        variant: "ghost",
        size:"sm"
      }), 'bg-primary/10 text-primary')}>Detalles</PopoverTrigger>
      <PopoverContent>
        <Card>
            <CardHeader>
                <CardTitle>Almacén de Destino</CardTitle>
                <CardDescription>Detalles del almacén de destino.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-semibold">Nombre</TableCell>
                            <TableCell>{oneStorageQuery.data[0].name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Sucursal</TableCell>
                            <TableCell>{oneStorageQuery.data[0].branch.name}</TableCell>
                        </TableRow>
                        { oneStorageQuery.data[0].location && <TableRow>
                            <TableCell className="font-semibold">Ubicación</TableCell>
                            <TableCell>{oneStorageQuery.data[0].location}</TableCell>
                        </TableRow>}
                        {/* <TableRow>
                            <TableCell className="font-medium">Sucursal</TableCell>
                            <TableCell>{oneStorageQuery.data[0].Branch.name}</TableCell>
                        </TableRow> */}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
