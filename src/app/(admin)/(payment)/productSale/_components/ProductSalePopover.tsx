import { OutgoingProductStock } from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PopoverProps } from "@radix-ui/react-popover";
import React from "react";

interface ProductStockDetailProps extends PopoverProps {
  productStock: OutgoingProductStock;
}
export function ProductStockDetailPopover({
  productStock,
  ...rest
}: ProductStockDetailProps) {
  const stockData = productStock.Stock;
  const stockTotal = stockData.reduce((acc, stock) => acc + stock.stock, 0);
  // const stockByStorageLabel = stockData.map((stock) => `${stock.Storage.name}: ${stock.stock}`).join(", ");
  return (
    // Todo: Falta modificar la relacion con la sede
    <Popover {...rest}>
      <PopoverTrigger
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "sm",
          }),
          "bg-primary/10 text-primary"
        )}
      >
        Detalles
      </PopoverTrigger>
      <PopoverContent className="min-w-80">
        <Card>
          <CardHeader>
            <CardTitle>Detalle del stock</CardTitle>
            <CardDescription>
              Visualizacion de la cantidad, almacén y sucursal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Almacén</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* <TableRow>
                            <TableCell>{stockTotal}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Distribución</TableCell>
                            <TableCell>{stockByStorageLabel}</TableCell>
                        </TableRow> */}
                {stockData.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell className="capitalize">
                      {stock.Storage.branch?.name ?? "Sucursal desconocida"}
                    </TableCell>
                    <TableCell className="capitalize">{stock.Storage.name}</TableCell>
                    <TableCell className="text-end">{stock.stock}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-primary/10 w-full">
                  <TableCell colSpan={2} className="font-semibold">
                    TOTAL
                  </TableCell>
                  <TableCell className="text-end font-semibold">{stockTotal}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
