import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PrescriptionItemResponse } from "../../_interfaces/prescription.interface";
import { Stethoscope } from "lucide-react";

interface PrescriptionMedicamentsTableProps extends React.HTMLAttributes<HTMLDivElement> {
  data: PrescriptionItemResponse[];
}

export function PrescriptionServicesCardTable({ data, ...props }: PrescriptionMedicamentsTableProps) {

  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <CardTitle className="text-primary flex space-x-2 items-center">
            <Stethoscope></Stethoscope>
            <span>Servicios recetados</span>
        </CardTitle>
        <CardDescription>Lista de servicios de la prescripción</CardDescription>
      </CardHeader>
      <CardContent>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-black/50 font-bold">
                    No hay servicios recetados en la prescripción
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item.id ?? index}>
                    <TableCell className="font-medium">{item.name ?? 'N/A'}</TableCell>
                    <TableCell>{item.quantity ?? 0}</TableCell>
                    <TableCell className="text-ellipsis">{item.description ?? 'Sin descripción'}</TableCell>
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
