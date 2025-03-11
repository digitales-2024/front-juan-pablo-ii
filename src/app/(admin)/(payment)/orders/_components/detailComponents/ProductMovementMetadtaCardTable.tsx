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
import { Pill } from "lucide-react";
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
  // const [selectedStorage, setSelectedStorage] = useState<string | undefined>(undefined);

  // Lista simulada de almacenes - reemplazar con datos reales
  // const storages = [
  //   { id: "1", name: "Almacén Principal" },
  //   { id: "2", name: "Farmacia" },
  //   { id: "3", name: "Depósito" }
  // ];

  const productsIds = data.map((item) => item.productId);

  const manyProductsQuery = useManyProductsStock();
  const { productStockQuery } = manyProductsQuery(productsIds, orderId);

  if (productStockQuery.isLoading) {
    return (
      <TableSkeleton></TableSkeleton>
    );
  }
  if (productStockQuery.isError) {
    return <GeneralErrorMessage
        error={productStockQuery.error}
        reset={productStockQuery.refetch}
    ></GeneralErrorMessage>;
  }

    if (!productStockQuery.data) {
        return <TableSkeleton></TableSkeleton>;
    }
  return (
    <Card className="w-full" {...rest}>
      <CardHeader>
        <CardTitle className="text-primary flex space-x-2 items-center">
          <Pill></Pill>
          <span>Productos vendidos</span>
        </CardTitle>
        <CardDescription>Lista de productos facturados</CardDescription>
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
                <TableHead>Codigo</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Almacén de salida</TableHead>
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
                        (stock) => stock.id === item.productId
                    );
                    const stockData = productData?.Stock.find(
                        (stock) => stock.Storage.id === item.storageId
                    );
                    const storageData = stockData?.Storage
                    return (
                  <TableRow key={item.productId ?? index}>
                    <TableCell>
                      {productData?.codigoProducto ?? "Cantidad no disponible"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.name ?? "N/A"}
                    </TableCell>
                    <TableCell>{item.quantity ?? 0}</TableCell>
                    <TableCell>
                      {item.quantity ?? "Cantidad no disponible"}
                    </TableCell>
                    {/* <TableCell>
                      {selectedStorage ? 
                        storages.find(s => s.id === selectedStorage)?.name ?? 'No seleccionado' : 
                        'No seleccionado'}
                    </TableCell> */}
                    <TableCell>
                      {item.price.toLocaleString(
                        "es-PE",
                        { 
                            minimumFractionDigits: 2, maximumFractionDigits: 2 ,
                            currency: "PEN"
                        }
                      ) ?? "Precio no disponible"}
                    </TableCell>
                    <TableCell>
                      {storageData?.name ?? "Almacén no disponible"}
                    </TableCell>
                  </TableRow>
                )})
              )}
              {
                <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={2} className="text-right">
                        Totales:
                    </TableCell>
                    <TableCell>
                        {data.reduce((total, item) => total + (item.quantity ?? 0), 0)}
                    </TableCell>
                    <TableCell>
                        ${data.reduce((total, item) => total + (item.price ?? 0), 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: "PEN" })}
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
