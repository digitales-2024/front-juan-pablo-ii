"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import {
  DetailedOrder,
  MedicalAppointmentMetadata,
  MedicalPrescriptionMetadata,
  orderStatusConfig,
  orderTypeConfig,
  paymentOptionButtons,
  paymentStatusConfig,
  ProductSaleMetadata,
} from "../_interfaces/order.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactElement, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ProcessPaymentDialog } from "./paymentComponents/processPayment/ProcessPaymentDialog";
import { DeactivateStorageDialog } from "./DeactivateOrderDialog";
import { ReactivateOrderDialog } from "./ReactivateOrderDialog";
import { VerifyPaymentDialog } from "./paymentComponents/verifyPayment/VerifyPaymentDialog";
// import { RefundPaymentDialog } from "./paymentComponents/refundPayment/RefundPaymentDialog";
import { CancelPaymentDialog } from "./paymentComponents/cancelPayment/CancelPaymentDialog";
import { RejectPaymentDialog } from "./paymentComponents/rejectPayment/RejectPaymentDialog";
import { ShowProductSaleMetadataDetailsDialog } from "./detailComponents/ShowProductSaleMetadataDialog";
import { toast } from "sonner";
import { ShowPrescriptionMetadataDetailsDialog } from "./detailComponents/ShowOrderPrescriptionMetadataDialog";
import { ShowAppointmentMetadataDialog } from "./detailComponents/ShowAppointmentMetadataDialog";

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
      const config = orderTypeConfig[row.original.type];
      const Icon = config.icon;
      return (
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
      const config = orderStatusConfig[row.original.status];
      const Icon = config.icon;
      return (
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
  {
    accessorKey: "payments.status",
    meta: { title: "Estado de pago" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado de Pago" />
    ),
    cell: ({ row }) => {
      // orderTypeConfig
      // orderStatusConfig
      const order = row.original;
      const regularPayment = order.payments.find(
        (payment) => payment.type !== "REFUND"
      );
      const refundPayment = order.payments.find(
        (payment) => payment.type === "REFUND"
      );
      const config = paymentStatusConfig[regularPayment?.status ?? refundPayment?.status ?? "PENDING"];
      const Icon = config.icon;
      return (
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
    accessorKey: "metadata",
    size: 10,
    meta: {
      title: "Detalles",
    },
    header: () => <div>Detalles</div>,
    cell: ({ row }) => {
      if (!row.original.metadata) {
        return null;
      }
      let metadata: unknown = null;
      try {
        if (row.original.metadata) {
          metadata = JSON.parse(row.original.metadata);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Error al parsear metadata: " + error.message);
        }
        toast.error("Error al parsear metadata");
        return null;
      }

      let MetadataDialog: () => ReactElement = () => <div></div>;
      switch (row.original.type) {
        case "PRODUCT_SALE_ORDER":
          MetadataDialog = () => (<ShowProductSaleMetadataDetailsDialog
            data={metadata as ProductSaleMetadata}
            orderId={row.original.id}
          ></ShowProductSaleMetadataDetailsDialog>)
          break;
        case "MEDICAL_PRESCRIPTION_ORDER":
          MetadataDialog = () => {
            return <ShowPrescriptionMetadataDetailsDialog
              data={metadata as MedicalPrescriptionMetadata}
              orderId={row.original.id}
            ></ShowPrescriptionMetadataDetailsDialog>
          }
          break;

        case "MEDICAL_APPOINTMENT_ORDER":
          MetadataDialog = () => <ShowAppointmentMetadataDialog
            data={metadata as MedicalAppointmentMetadata}
            orderId={row.original.id}
          ></ShowAppointmentMetadataDialog>
          break;
        default:
          MetadataDialog = () => <div></div>
          break;
      }
      return <div>
        {<MetadataDialog />}
      </div>
    },
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
  {
    accessorKey: "actions",
    size: 10,
    meta: { title: "Acciones" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    cell: function Cell({ row }) {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showReactivateDialog, setShowReactivateDialog] = useState(false);
      // const [showEditSheet, setShowEditSheet] = useState(false);
      const [showCancelOrderDialog, setShowCancelOrderDialog] = useState(false);
      const [showProcessPaymentDialog, setShowProcessPaymentDialog] =
        useState(false);
      const [showVerifyPaymentDialog, setShowVerifyPaymentDialog] =
        useState(false);
      const [showRejectPaymentDialog, setShowRejectPaymentDialog] =
        useState(false);
      // const [showRefundPaymentDialog, setShowRefundPaymentDialog] =
      //   useState(false);
      const order = row.original;
      const { isActive } = order;
      // const isSuperAdmin = true;

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
      const isPaymentPending =
        regularPayment && regularPayment.status === "PENDING";
      const isPaymentCompleted =
        regularPayment && regularPayment.status === "COMPLETED";
      const isPaymentProcessed =
        regularPayment && regularPayment.status === "PROCESSING";
      const isPaymentCancelled =
        regularPayment && regularPayment.status === "CANCELLED";
      const isPaymentRefunded =
        refundPayment && refundPayment.status === "COMPLETED"; //The first resgular payment has "REFUNDED" status, but the REFUND payment has "COMPLETED" status

      //GeneralValidations
      const shouldProcessPayment = isOrderPending && isPaymentPending;
      // const isAppointmentOrPrescription = order.type === "MEDICAL_APPOINTMENT_ORDER";
      const couldCancelOrder = isOrderPending && isPaymentPending;
      const shouldVerifyPayment = isOrderPending && isPaymentProcessed;
      const couldRejectPayment = isOrderPending && isPaymentProcessed;
      // const couldRefundPayment = isOrderCompleted && isPaymentCompleted;
      const cannotProcessPayment =
        isOrderCancelled ??
        isOrderRefunded ??
        isPaymentCancelled ??
        isPaymentRefunded;

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const couldCloseAndStore = (isOrderCompleted && isPaymentCompleted) || (isOrderCancelled && isPaymentCancelled) || (isOrderRefunded && isPaymentRefunded);

      return (
        <div>
          <div>
            {/* <UpdateStorageSheet
              storage={storage}
              open={showEditSheet}
              onOpenChange={setShowEditSheet}
              showTrigger={false}
            /> */}
            {couldCloseAndStore && showDeleteDialog && <DeactivateStorageDialog
              order={row.original}
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              showTrigger={false}
            />}

            {showReactivateDialog && <ReactivateOrderDialog
              order={row.original}
              open={showReactivateDialog}
              onOpenChange={setShowReactivateDialog}
              showTrigger={false}
            />}

            {shouldProcessPayment && showProcessPaymentDialog && (
              <ProcessPaymentDialog
                open={showProcessPaymentDialog}
                onOpenChange={setShowProcessPaymentDialog}
                order={order}
                payment={regularPayment}
                showTrigger={false}
              ></ProcessPaymentDialog>
            )}

            {shouldVerifyPayment && showVerifyPaymentDialog && (
              <VerifyPaymentDialog
                open={showVerifyPaymentDialog}
                onOpenChange={setShowVerifyPaymentDialog}
                order={order}
                payment={regularPayment}
              ></VerifyPaymentDialog>
            )}

            {couldCancelOrder && showCancelOrderDialog && (
              <CancelPaymentDialog
                open={showCancelOrderDialog}
                onOpenChange={setShowCancelOrderDialog}
                order={order}
                payment={regularPayment}
              ></CancelPaymentDialog>
            )}

            {couldRejectPayment && showRejectPaymentDialog && (
              <RejectPaymentDialog
                open={showRejectPaymentDialog}
                onOpenChange={setShowRejectPaymentDialog}
                order={order}
                payment={regularPayment}
              ></RejectPaymentDialog>
            )}

            {/* {couldRefundPayment && showRefundPaymentDialog && (
              <RefundPaymentDialog
                open={showRefundPaymentDialog}
                onOpenChange={setShowRefundPaymentDialog}
                order={order}
                payment={regularPayment}
              ></RefundPaymentDialog>
            )} */}
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
            <DropdownMenuContent align="end" className="w-40 space-y-1">
              {shouldProcessPayment && (
                <DropdownMenuItem
                  onSelect={() => setShowProcessPaymentDialog(true)}
                  disabled={!isActive}
                  className={cn(
                    paymentOptionButtons.PROCESS.backgroundColor,
                    paymentOptionButtons.PROCESS.textColor,
                    paymentOptionButtons.PROCESS.hoverBgColor
                  )}
                >
                  {
                    <paymentOptionButtons.PROCESS.icon></paymentOptionButtons.PROCESS.icon>
                  }
                  Procesar Pago
                </DropdownMenuItem>
              )}

              {shouldVerifyPayment && (
                <DropdownMenuItem
                  onSelect={() => setShowVerifyPaymentDialog(true)}
                  disabled={!isActive}
                  className={cn(
                    paymentOptionButtons.VERIFY.backgroundColor,
                    paymentOptionButtons.VERIFY.textColor,
                    paymentOptionButtons.VERIFY.hoverBgColor
                  )}
                >
                  {
                    <paymentOptionButtons.VERIFY.icon></paymentOptionButtons.VERIFY.icon>
                  }
                  Verificar Pago
                </DropdownMenuItem>
              )}

              {couldCancelOrder && (
                <DropdownMenuItem
                  onSelect={() => setShowCancelOrderDialog(true)}
                  disabled={!isActive}
                  className={cn(
                    paymentOptionButtons.CANCEL.backgroundColor,
                    paymentOptionButtons.CANCEL.textColor,
                    paymentOptionButtons.CANCEL.hoverBgColor
                  )}
                >
                  {
                    <paymentOptionButtons.CANCEL.icon></paymentOptionButtons.CANCEL.icon>
                  }
                  Cancelar Órden
                </DropdownMenuItem>
              )}

              {couldRejectPayment && (
                <DropdownMenuItem
                  onSelect={() => setShowRejectPaymentDialog(true)}
                  disabled={!isActive}
                  className={cn(
                    paymentOptionButtons.REJECT.backgroundColor,
                    paymentOptionButtons.REJECT.textColor,
                    paymentOptionButtons.REJECT.hoverBgColor
                  )}
                >
                  {
                    <paymentOptionButtons.REJECT.icon></paymentOptionButtons.REJECT.icon>
                  }
                  Rechazar Pago
                </DropdownMenuItem>
              )}

              {/* {couldRefundPayment && (
                <DropdownMenuItem
                  onSelect={() => setShowRefundPaymentDialog(true)}
                  disabled={!isActive}
                  className={cn(
                    paymentOptionButtons.REFUND.backgroundColor,
                    paymentOptionButtons.REFUND.textColor,
                    paymentOptionButtons.REFUND.hoverBgColor
                  )}
                >
                  {
                    <paymentOptionButtons.REFUND.icon></paymentOptionButtons.REFUND.icon>
                  }
                  Reembolsar
                </DropdownMenuItem>
              )} */}

              {cannotProcessPayment && <DropdownMenuSeparator />}

              {cannotProcessPayment && (
                <DropdownMenuItem disabled>
                  No acciones disponibles
                </DropdownMenuItem>
              )}

              {couldCloseAndStore && isActive && <DropdownMenuSeparator />}
              {
                couldCloseAndStore && isActive && <DropdownMenuItem
                  onSelect={() => setShowDeleteDialog(true)}
                  disabled={!isActive}
                  className={cn(
                    paymentOptionButtons.CLOSE.backgroundColor,
                    paymentOptionButtons.CLOSE.textColor,
                    paymentOptionButtons.CLOSE.hoverBgColor
                  )}
                >
                  {
                    <paymentOptionButtons.CLOSE.icon></paymentOptionButtons.CLOSE.icon>
                  }
                  {
                    paymentOptionButtons.CLOSE.name
                  }
                </DropdownMenuItem>
              }

              {couldCloseAndStore && !isActive && <DropdownMenuSeparator />}
              {
                couldCloseAndStore && !isActive && <DropdownMenuItem
                  onSelect={() => setShowReactivateDialog(true)}
                  disabled={!isActive}
                  className={cn(
                    paymentOptionButtons.RESTORE.backgroundColor,
                    paymentOptionButtons.RESTORE.textColor,
                    paymentOptionButtons.RESTORE.hoverBgColor
                  )}
                >
                  {
                    <paymentOptionButtons.RESTORE.icon></paymentOptionButtons.RESTORE.icon>
                  }
                  {
                    paymentOptionButtons.RESTORE.name
                  }
                </DropdownMenuItem>
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
