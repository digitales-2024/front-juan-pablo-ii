"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import {
  DetailedOrder,
  orderStatusConfig,
  orderTypeConfig,
} from "../_interfaces/order.interface";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ellipsis, RefreshCcwDot, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
// import { UpdateStorageSheet } from "./UpdateStorageSheet";
// import { ReactivateStorageDialog } from "./ReactivateProductDialog";
// import { DeactivateStorageDialog } from "./DeactivateStorageDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ReactivateStorageDialog } from "@/app/(admin)/(catalog)/storage/storages/_components/ReactivateProductDialog";
import { UpdateStorageSheet } from "@/app/(admin)/(catalog)/storage/storages/_components/UpdateStorageSheet";
import { ProcessPaymentDialog } from "./paymentComponents/processPayment/ProcessPaymentDialog";
// import Image from "next/image";

export const columns: ColumnDef<DetailedOrder>[] = [
  {
    accessorKey: "select",
    size: 10,
    meta: { title: "Select" },
    header: ({ table }) => (
      <div className="px-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
  {
    accessorKey: "date",
    meta: { title: "Fecha" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.date), "PPp", { locale: es }),
  },
  {
    accessorKey: "type",
    meta: { title: "Tipo de órden" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de órden" />
    ),
    cell: ({ row }) => {
      // orderTypeConfig
      // orderStatusConfig
      const config = orderTypeConfig[row.original.type];
      const Icon = config.icon;
      return (
        // <span>
        //   {row.original.status || "Sin tipo de almacén"}
        // </span>
        <Badge
          className={cn(
            config.backgroundColor,
            config.textColor,
            config.hoverBgColor,
            "flex space-x-1 items-center justify-center text-sm"
          )}
        >
          <Icon className="size-4" />
          <span>{config.name}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    meta: { title: "Estado de Órden" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado de Órden" />
    ),
    cell: ({ row }) => {
      // orderTypeConfig
      // orderStatusConfig
      const config = orderStatusConfig[row.original.status];
      const Icon = config.icon;
      return (
        // <span>
        //   {row.original.status || "Sin tipo de almacén"}
        // </span>
        <Badge
          className={cn(
            config.backgroundColor,
            config.textColor,
            config.hoverBgColor,
            "flex space-x-1 items-center justify-center text-sm"
          )}
        >
          <Icon className="size-4"></Icon>
          <span>{config.name}</span>
        </Badge>
      );
    },
  },
  // {
  //   accessorKey: "",
  //   meta: { title: "Estado de Órden" },
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Estado de Órden" />
  //   ),
  //   cell: ({ row }) => {
  //     // orderTypeConfig
  //     // orderStatusConfig
  //     const config = orderStatusConfig[row.original.status];
  //     const Icon = config.icon;
  //     return (
  //       // <span>
  //       //   {row.original.status || "Sin tipo de almacén"}
  //       // </span>
  //       <Badge className={cn(config.backgroundColor, config.textColor, config.hoverBgColor, "flex space-x-1 items-center justify-center text-sm")}>
  //         <Icon className="size-4"></Icon>
  //         <span>{config.name}</span>
  //       </Badge>
  //     );
  //   },
  // },
  {
    accessorKey: "tax",
    meta: { title: "Impuestos" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Impuestos aplicados" />
    ),
    cell: ({ row }) => (
      <span>
        {new Intl.NumberFormat("es-PE", {
          style: "currency",
          currency: row.original.currency,
        }).format(row.original.tax)}
      </span>
    ),
  },
  {
    accessorKey: "subtotal",
    meta: { title: "Subtotal" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subtotal" />
    ),
    cell: ({ row }) => (
      <span>
        {new Intl.NumberFormat("es-PE", {
          style: "currency",
          currency: row.original.currency,
        }).format(row.original.subtotal)}
      </span>
    ),
  },
  {
    accessorKey: "total",
    meta: { title: "Total" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => (
      <span>
        {new Intl.NumberFormat("es-PE", {
          style: "currency",
          currency: row.original.currency,
        }).format(row.original.total)}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    meta: { title: "Elim. Lógica" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Elim. Lógica" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "success" : "destructive"}>
        {row.original.isActive ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  // {
  //   accessorKey: "createdAt",
  //   meta: { title: "Fecha de creación" },
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Fecha de creación" />
  //   ),
  //   cell: ({ row }) =>
  //     format(new Date(row.original.createdAt), "PPp", { locale: es }),
  // },
  {
    accessorKey: "actions",
    size: 10,
    meta: { title: "Acciones" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    cell: function Cell({ row }) {
      // const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      // const [showReactivateDialog, setShowReactivateDialog] = useState(false);
      // const [showEditSheet, setShowEditSheet] = useState(false);
      const [showCancelOrderDialog, setShowCancelOrderDialog] = useState(false);
      const [showProcessPaymentDialog, setShowProcessPaymentDialog] = useState(false);
      const [showVerifyPaymentDialog, setShowVerifyPaymentDialog] = useState(false);
      const [showRejectPaymentDialog, setShowRejectPaymentDialog] = useState(false);
      const [showRefundPaymentDialog, setShowRefundPaymentDialog] = useState(false);
      const order = row.original;
      const { isActive } = order;
      const isSuperAdmin = true;

      const orderStatus = order.status;
      const regularPayment = order.payments.find(
        (payment) => payment.type !== "REFUND"
      );
      const refundPayment = order.payments.find(
        (payment) => payment.type === "REFUND"
      );

      //order validations
      const isOrderPending = orderStatus === "PENDING";
      const isOrderCompleted = orderStatus === "COMPLETED";
      const isOrderCancelled = orderStatus === "CANCELLED";
      const isOrderRefunded = orderStatus === "REFUNDED";

      //payment validations
      const isPaymentPending = regularPayment && regularPayment.status === "PENDING";
      const isPaymentCompleted = regularPayment && regularPayment.status === "COMPLETED";
      const isPaymentProcessed = regularPayment && regularPayment.status === "PROCESSING";
      const isPaymentCancelled = regularPayment && regularPayment.status === "CANCELLED";
      const isPaymentRefunded = refundPayment && refundPayment.status === "REFUNDED";

      //GeneralValidations
      const shouldProcessPayment = isOrderPending && isPaymentPending;
      const couldCancelOrder = isOrderPending && isPaymentPending;
      const shouldVerifyPayment = isOrderPending && isPaymentProcessed;
      const couldRejectPayment = isOrderPending && isPaymentProcessed;
      const couldRefundPayment = isOrderCompleted && isPaymentCompleted;
      const cannotProcessPayment = isOrderCancelled ?? isOrderRefunded ?? isPaymentCancelled ?? isPaymentRefunded;

      return (
        <div>
          <div>
            {/* <UpdateStorageSheet
              storage={storage}
              open={showEditSheet}
              onOpenChange={setShowEditSheet}
              showTrigger={false}
            />
            <DeactivateStorageDialog
              storage={storage}
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              showTrigger={false}
            />
            <ReactivateStorageDialog
              storage={storage}
              open={showReactivateDialog}
              onOpenChange={setShowReactivateDialog}
              showTrigger={false}
            /> */}

              {shouldProcessPayment && showProcessPaymentDialog &&<ProcessPaymentDialog
                open={showProcessPaymentDialog}
                onOpenChange={setShowProcessPaymentDialog}
                order={order}
                payment={regularPayment}
                showTrigger = {false}
              ></ProcessPaymentDialog>}
{/* 
              {shouldVerifyPayment && <ProcessPaymentDialog
                open={showVerifyPaymentDialog}
                onOpenChange={setShowVerifyPaymentDialog}
                order={order}
                payment={regularPayment}
              ></ProcessPaymentDialog>}

              {couldRejectPayment && <ProcessPaymentDialog
                open={showRejectPaymentDialog}
                onOpenChange={setShowRejectPaymentDialog}
                order={order}
                payment={regularPayment}
              ></ProcessPaymentDialog>}

              {couldRefundPayment && <ProcessPaymentDialog
                open={showRefundPaymentDialog}
                onOpenChange={setShowRefundPaymentDialog}
                order={order}
                payment={regularPayment}
              ></ProcessPaymentDialog>} */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {shouldProcessPayment && <DropdownMenuItem
                onSelect={() => setShowProcessPaymentDialog(true)}
                disabled={!isActive}
              >
                Procesar Pago
              </DropdownMenuItem>}
              <DropdownMenuSeparator />

              {
                cannotProcessPayment && (
                  <DropdownMenuItem disabled>
                    No se puede procesar el pago
                  </DropdownMenuItem>
                )
              }

              {/* {isSuperAdmin && (
                <DropdownMenuItem
                  onSelect={() => setShowReactivateDialog(true)}
                  disabled={isActive}
                >
                  Reactivar
                  <DropdownMenuShortcut>
                    <RefreshCcwDot className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                disabled={!isActive}
              >
                Eliminar
                <DropdownMenuShortcut>
                  <Trash className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
];
