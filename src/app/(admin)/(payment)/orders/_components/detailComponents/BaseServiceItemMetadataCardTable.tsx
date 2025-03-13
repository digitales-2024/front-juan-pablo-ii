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
import { useServices } from "@/app/(admin)/services/_hooks/useServices";
import TableSkeleton from "./TableSkeleton";
import GeneralErrorMessage from "../errorComponents/GeneralErrorMessage";

interface BaseServiceItemMetadataCardTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: BaseServiceItem[];
}

export function BaseServiceItemMetadataCardTable({
  data,
  ...props
}: BaseServiceItemMetadataCardTableProps) {
  const { servicesQuery } = useServices();

  if (servicesQuery.isLoading) {
    return <TableSkeleton></TableSkeleton>;
  }
  if (servicesQuery.isError) {
    return (
      <GeneralErrorMessage
        error={servicesQuery.error}
        reset={servicesQuery.refetch}
      ></GeneralErrorMessage>
    );
  }

  if (!servicesQuery.data) {
    return <TableSkeleton></TableSkeleton>;
  }

  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <CardTitle className="text-primary flex space-x-2 items-center">
          <Stethoscope></Stethoscope>
          <span>Servicios contratados</span>
        </CardTitle>
        <CardDescription>
          Detalles de los servicios contratados por el paciente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead className="text-center">Precio</TableHead>
                <TableHead className="text-center">Total</TableHead>
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
                data.map((item, index) => {
                  // const serviceData = servicesQuery.data?.find(
                  //   (service) => service.id === item.id
                  // );
                  // console.log('serviceData query', servicesQuery.data);
                  // console.log('serviceData', serviceData);
                  // console.log('service id', item.id);
                  // console.log('service id comparison', serviceData?.id === item.id);
                  // const servicePrice = serviceData?.price ?? 0;
                  const total = isNaN(item.servicePrice * (item.quantity ?? 0))
                    ? 0
                    : item.servicePrice * (item.quantity ?? 0);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.name ?? "---"}
                      </TableCell>
                      <TableCell className="text-center">{item.quantity ?? "---"}</TableCell>
                      <TableCell className="text-center">
                        {item.servicePrice ?? "---"}
                      </TableCell>
                      <TableCell className="text-center">
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
                  <TableCell className="text-start">
                    Totales:
                  </TableCell>
                  <TableCell className="text-center">
                    {data.reduce(
                      (total, item) => total + (item.quantity ?? 0),
                      0
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center">
                    {data
                      .reduce(
                        (total, item) =>
                          total +
                          (isNaN((item.servicePrice ?? 0) * (item.quantity ?? 0))
                            ? 0
                            : (item.servicePrice ?? 0) * (item.quantity ?? 0)),
                        0
                      )
                      .toLocaleString("es-PE", {
                        style: "currency",
                        currency: "PEN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
