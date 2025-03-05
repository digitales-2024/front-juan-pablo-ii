import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PrescriptionItemResponse } from "../../_interfaces/prescription.interface";

interface PrescriptionMedicamentsTableProps {
  data: PrescriptionItemResponse[];
  // branchId: string;
}

export function PrescriptionMedicamentsCardTable({ data }: PrescriptionMedicamentsTableProps) {
  // const [selectedStorage, setSelectedStorage] = useState<string | undefined>(undefined);

  // Lista simulada de almacenes - reemplazar con datos reales
  // const storages = [
  //   { id: "1", name: "Almacén Principal" },
  //   { id: "2", name: "Farmacia" },
  //   { id: "3", name: "Depósito" }
  // ];

  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medicamentos recetados</CardTitle>
        <CardDescription>Lista de medicamentos de la prescripción</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <div className="mb-4">
          <Select onValueChange={setSelectedStorage} value={selectedStorage}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Seleccionar almacén" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-48">
                {storages.map((storage) => (
                  <SelectItem key={storage.id} value={storage.id}>
                    {storage.name}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div> */}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Descripción</TableHead>
                {/* <TableHead>Sucursal</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No hay medicamentos en la prescripción
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item.id ?? index}>
                    <TableCell className="font-medium">{item.name ?? 'N/A'}</TableCell>
                    <TableCell>{item.quantity ?? 0}</TableCell>
                    <TableCell>{item.description ?? 'Sin descripción'}</TableCell>
                    {/* <TableCell>
                      {selectedStorage ? 
                        storages.find(s => s.id === selectedStorage)?.name ?? 'No seleccionado' : 
                        'No seleccionado'}
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
