import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Stethoscope } from "lucide-react";
import { PatientDetailsMetadata } from "../../_interfaces/order.interface";

interface OrderPatientMetadataDetailsTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: PatientDetailsMetadata;
}

export function OrderPatientDetailsMetadataCardTable({
  data,
  ...props
}: OrderPatientMetadataDetailsTableProps) {
  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <CardTitle className="text-primary flex space-x-2 items-center">
          <Stethoscope></Stethoscope>
          <span>Paciente</span>
        </CardTitle>
        <CardDescription>Detalles del paciente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DNI</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-black/50 font-bold"
                  >
                    No hay detalles del paciente
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>{data.dni ?? '---'}</TableCell>
                  <TableCell className="font-medium">
                    {data.fullName ?? "NN"}
                  </TableCell>
                  <TableCell>
                    {data.phone ?? "---"}
                  </TableCell>
                  <TableCell className="text-ellipsis">
                    {data.address ?? "---"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
