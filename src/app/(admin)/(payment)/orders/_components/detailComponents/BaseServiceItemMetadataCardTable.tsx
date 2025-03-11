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
import { BaseServiceItem } from "../../_interfaces/order.interface";

interface BaseServiceItemMetadataCardTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: BaseServiceItem[];
}

export function BaseServiceItemMetadataCardTable({
  data,
  ...props
}: BaseServiceItemMetadataCardTableProps) {
  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <CardTitle className="text-primary flex space-x-2 items-center">
          <Stethoscope></Stethoscope>
          <span>Servicios contratados</span>
        </CardTitle>
        <CardDescription>Detalles de los servicios contratados por el paciente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-black/50 font-bold"
                  >
                    No hay detalles de los servicios contratados
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                    <TableRow key={index}>
                  <TableCell className="font-medium">
                    {item.name ?? "---"}
                  </TableCell>
                  <TableCell>
                    {item.quantity ?? "---"}
                  </TableCell>
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
