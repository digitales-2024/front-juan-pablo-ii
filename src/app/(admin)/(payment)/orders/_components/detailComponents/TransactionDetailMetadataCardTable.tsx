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
import { TransactionDetails } from "../../_interfaces/order.interface";

interface TransactionDetailsMetadataTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: TransactionDetails;
}

export function TransactionDetailsMetadataCardTable({
  data,
  ...props
}: TransactionDetailsMetadataTableProps) {
  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <CardTitle className="text-primary flex space-x-2 items-center">
          <Stethoscope></Stethoscope>
          <span>Totales</span>
        </CardTitle>
        <CardDescription>Total de la suma de todos los items istados en la ordén</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={3}></TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-black/50 font-bold"
                  >
                    No hay totales
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={3}></TableCell>
                  <TableCell className="text-ellipsis">
                    {data.total.toLocaleString("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    })}
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
