"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    ChevronRight,
    Clock,
    Calendar,
    MapPin,
    User,
    Stethoscope,
    ClipboardList,
    Clipboard,
    CircleDollarSign,
    Phone,
    Mail,
    CreditCard,
    AlertCircle,
    XCircle,
    RefreshCcw,
    CalendarX,
    Banknote
} from "lucide-react";
import { Appointment, appointmentStatusConfig } from "../_interfaces/appointments.interface";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AppointmentDetailsDialogProps {
    appointment: Appointment | null;
    loading?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
    onClose?: () => void;
}

// Extendemos la interfaz Appointment para incluir campos que añadimos en el repositorio
interface ExtendedAppointment extends Appointment {
    order?: {
        id: string;
        code?: string;
        total?: number;
        status?: string;
    };
    rescheduledFrom?: {
        id: string;
        start: string;
        end: string;
    };
}

export function AppointmentDetailsDialog({
    appointment,
    loading = false,
    open,
    onOpenChange,
    children,
    onClose
}: AppointmentDetailsDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Formato para la fecha y hora
    const formatDate = (dateString: string) => {
        if (!dateString) return "No disponible";
        return format(new Date(dateString), 'PPP', { locale: es });
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return "No disponible";
        return format(new Date(dateString), 'HH:mm', { locale: es });
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return "No disponible";
        return format(new Date(dateString), 'PPP HH:mm', { locale: es });
    };

    // Funciones para formatear el texto del método de pago
    const formatPaymentMethod = (method: string) => {
        const methods: Record<string, string> = {
            'CASH': 'Efectivo',
            'BANK_TRANSFER': 'Transferencia bancaria',
            'DIGITAL_WALLET': 'Billetera digital'
        };
        return methods[method] || method;
    };

    // Componente para mostrar info cuando está cargando
    const LoadingSkeleton = () => (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-48" />
            </div>
            <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-64" />
            </div>
            <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-40" />
            </div>
        </div>
    );

    // Componente para mostrar un campo de información
    const InfoField = ({
        icon: Icon,
        label,
        value,
        className = ""
    }: {
        icon: React.ElementType;
        label: string;
        value: string | React.ReactNode;
        className?: string;
    }) => (
        <div className={cn("flex flex-col space-y-1", className)}>
            <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-primary" />
                <Label className="text-sm font-medium">{label}</Label>
            </div>
            <span className="text-sm pl-6">{value}</span>
        </div>
    );

    // Renderizar el contenido del diálogo
    const AppointmentDetails = () => {
        if (loading) {
            return <LoadingSkeleton />;
        }

        if (!appointment) {
            return <p className="text-muted-foreground">No se encontró información de la cita.</p>;
        }

        // Usar casting para tratar el appointment como ExtendedAppointment
        const extendedAppointment = appointment as unknown as ExtendedAppointment;

        const statusConfig = appointmentStatusConfig[appointment.status];
        const StatusIcon = statusConfig?.icon;

        return (
            <div className="space-y-6">
                {/* Status badge */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Información de la cita</h3>
                    {statusConfig && (
                        <Badge
                            className={cn(
                                statusConfig.backgroundColor,
                                statusConfig.textColor,
                                statusConfig.hoverBgColor,
                                "flex space-x-1 items-center px-2 py-1"
                            )}
                        >
                            {StatusIcon && <StatusIcon className="size-4 mr-1" />}
                            <span>{statusConfig.name}</span>
                        </Badge>
                    )}
                </div>

                <Separator />

                {/* Fecha y hora */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                        icon={Calendar}
                        label="Fecha de la cita"
                        value={formatDate(appointment.start)}
                    />
                    <InfoField
                        icon={Clock}
                        label="Horario"
                        value={`${formatTime(appointment.start)} - ${formatTime(appointment.end)}`}
                    />
                </div>

                <Separator />

                {/* Información del paciente */}
                <div className="space-y-2">
                    <h4 className="font-medium">Datos del paciente</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField
                            icon={User}
                            label="Nombre completo"
                            value={appointment.patient ?
                                `${appointment.patient.name} ${appointment.patient.lastName || ''}`.trim() :
                                "No disponible"}
                        />
                        {appointment.patient?.dni && (
                            <InfoField
                                icon={Clipboard}
                                label="DNI"
                                value={appointment.patient.dni}
                            />
                        )}
                        {appointment.patient?.phone && (
                            <InfoField
                                icon={Phone}
                                label="Teléfono"
                                value={appointment.patient.phone}
                            />
                        )}
                        {appointment.patient?.email && (
                            <InfoField
                                icon={Mail}
                                label="Correo electrónico"
                                value={appointment.patient.email}
                            />
                        )}
                    </div>
                </div>

                <Separator />

                {/* Información del servicio y doctor */}
                <div className="space-y-2">
                    <h4 className="font-medium">Datos del servicio</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField
                            icon={ClipboardList}
                            label="Servicio"
                            value={appointment.service?.name || "No disponible"}
                        />
                        <InfoField
                            icon={Stethoscope}
                            label="Doctor"
                            value={appointment.staff ?
                                `${appointment.staff.name} ${appointment.staff.lastName || ''}`.trim() :
                                "No disponible"}
                        />
                        <InfoField
                            icon={MapPin}
                            label="Sucursal"
                            value={appointment.branch?.name || "No disponible"}
                        />
                        {appointment.service?.price && (
                            <InfoField
                                icon={CircleDollarSign}
                                label="Precio del servicio"
                                value={`S/. ${(appointment.service.price as number).toString()}`}
                            />
                        )}
                        {appointment.paymentMethod && (
                            <InfoField
                                icon={Banknote}
                                label="Método de pago"
                                value={formatPaymentMethod(appointment.paymentMethod)}
                            />
                        )}
                    </div>
                </div>

                {/* Datos de orden asociada */}
                {extendedAppointment.order && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <h4 className="font-medium">Datos de la orden</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField
                                    icon={CreditCard}
                                    label="Código de orden"
                                    value={extendedAppointment.order.code || extendedAppointment.orderId}
                                />
                                {extendedAppointment.order.total && (
                                    <InfoField
                                        icon={CircleDollarSign}
                                        label="Total pagado"
                                        value={`S/. ${(extendedAppointment.order.total as number).toString()}`}
                                    />
                                )}
                                {extendedAppointment.order.status && (
                                    <InfoField
                                        icon={AlertCircle}
                                        label="Estado de la orden"
                                        value={extendedAppointment.order.status}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Datos de reprogramación */}
                {appointment.rescheduledFromId && extendedAppointment.rescheduledFrom && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <h4 className="font-medium">Datos de reprogramación</h4>
                            <InfoField
                                icon={CalendarX}
                                label="Cita original"
                                value={`${formatDateTime(extendedAppointment.rescheduledFrom.start)} - ${formatTime(extendedAppointment.rescheduledFrom.end)}`}
                            />
                            {appointment.rescheduleReason && (
                                <InfoField
                                    icon={RefreshCcw}
                                    label="Motivo de reprogramación"
                                    value={appointment.rescheduleReason}
                                />
                            )}
                        </div>
                    </>
                )}

                {/* Notas adicionales si existen */}
                {appointment.notes && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <h4 className="font-medium">Notas adicionales</h4>
                            <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                                {appointment.notes}
                            </p>
                        </div>
                    </>
                )}

                {/* Razón de cancelación si existe */}
                {appointment.cancellationReason && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <h4 className="font-medium text-destructive flex items-center">
                                <XCircle className="h-4 w-4 mr-2" />
                                Razón de cancelación
                            </h4>
                            <p className="text-sm whitespace-pre-wrap bg-destructive/10 p-3 rounded-md text-destructive">
                                {appointment.cancellationReason}
                            </p>
                        </div>
                    </>
                )}

                {/* Razón de no presentación si existe */}
                {appointment.noShowReason && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <h4 className="font-medium text-amber-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Razón de no presentación
                            </h4>
                            <p className="text-sm whitespace-pre-wrap bg-amber-50 p-3 rounded-md text-amber-700">
                                {appointment.noShowReason}
                            </p>
                        </div>
                    </>
                )}

                {/* Fechas de creación y actualización */}
                <Separator />
                <div className="text-xs text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <span className="font-medium">Creada:</span> {formatDateTime(appointment.createdAt)}
                    </div>
                    <div>
                        <span className="font-medium">Actualizada:</span> {formatDateTime(appointment.updatedAt)}
                    </div>
                </div>
            </div>
        );
    };

    // Botones del footer
    const FooterContent = () => (
        <div className="flex justify-end"></div>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                {children && <DialogTrigger asChild>{children}</DialogTrigger>}
                <DialogContent className="sm:max-w-[600px] max-h-[calc(100vh-4rem)] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Detalles de la Cita</DialogTitle>
                        <DialogDescription>
                            Información completa de la cita médica.
                        </DialogDescription>
                    </DialogHeader>
                    <AppointmentDetails />
                    <DialogFooter>
                        <FooterContent />
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Detalles de la Cita</DrawerTitle>
                    <DrawerDescription>
                        Información completa de la cita médica.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 py-2 overflow-auto max-h-[calc(100dvh-10rem)]">
                    <AppointmentDetails />
                </div>
                <DrawerFooter>
                    <FooterContent />
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
} 