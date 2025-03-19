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
import { Syringe } from "lucide-react";
import { ProductMovement } from "../../_interfaces/order.interface";
import { useManyProductsStock } from "@/app/(admin)/(inventory)/stock/_hooks/useProductStock";
import TableSkeleton from "./TableSkeleton";
import GeneralErrorMessage from "../errorComponents/GeneralErrorMessage";

interface ProductMovementsMetadataTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: ProductMovement[];
  orderId: string;
  // branchId: string;
}

export function ProductMovementsMetadataTable({
  data,
  orderId,
  ...rest
}: ProductMovementsMetadataTableProps) {

  console.log("received metadata: ", data);
  const productsIds = data.map((item) => item.id);

  const manyProductsQuery = useManyProductsStock();
  const { productStockQuery } = manyProductsQuery(productsIds, orderId);

  if (productStockQuery.isLoading) {
    return <TableSkeleton></TableSkeleton>;
  }
  if (productStockQuery.isError) {
    return (
      <GeneralErrorMessage
        error={productStockQuery.error}
        reset={productStockQuery.refetch}
      ></GeneralErrorMessage>
    );
  }

  if (!productStockQuery.data) {
    return <TableSkeleton></TableSkeleton>;
  }
  return (
    <Card className="w-full" {...rest}>
      <CardHeader>
        <CardTitle className="text-primary flex space-x-2 items-center">
          <Syringe></Syringe>
          <span>Productos vendidos</span>
        </CardTitle>
        <CardDescription>Lista de productos facturados</CardDescription>
      </CardHeader>
      <CardContent>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Almacén de salida</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead className="text-center">Total</TableHead>
                {/* <TableHead>Sucursal</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-black/50 font-bold"
                  >
                    No hay medicamentos en la prescripción
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => {
                  const productData = productStockQuery.data.find(
                    (stock) => stock.id === item.id
                  );
                  const stockData = productData?.Stock.find(
                    (stock) => stock.Storage.id === item.storageId
                  );
                  const storageData = stockData?.Storage;
                  const total = isNaN(item.quantity * item.price)
                    ? "No disponible"
                    : item.quantity * item.price;
                  return (
                    <TableRow key={item.id ?? index}>
                      <TableCell>
                        {productData?.codigoProducto ??
                          "Cantidad no disponible"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.name ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        {storageData?.name ?? "Almacén no disponible"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity ?? "Cantidad no disponible"}
                      </TableCell>
                      <TableCell className="text-end">
                        {total.toLocaleString("es-PE", {
                          style: "currency",
                          currency: "PEN",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? "Precio no disponible"}
                      </TableCell>
                      
                    </TableRow>
                  );
                })
              )}
              {
                <TableRow className="font-bold bg-muted/50">
                  <TableCell colSpan={3} className="text-start">
                    Totales:
                  </TableCell>
                  <TableCell className="text-center">
                    {data.reduce(
                      (total, item) => total + (item.quantity ?? 0),
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-end">
                    {data
                      .reduce(
                        (total, item) =>
                          total +
                          (isNaN((item.price ?? 0) * (item.quantity ?? 0))
                            ? 0
                            : (item.price ?? 0) * (item.quantity ?? 0)),
                        0
                      )
                      .toLocaleString("es-PE", {
                        style: "currency",
                        currency: "PEN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
