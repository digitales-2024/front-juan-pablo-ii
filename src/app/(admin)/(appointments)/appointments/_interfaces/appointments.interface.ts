import { components } from "@/types/api";
import { z } from "zod";
import { LucideIcon, Clock, CheckCircle, XCircle, AlertTriangle, CalendarCheck, CalendarX, RefreshCcw } from "lucide-react";

// Tipos base de la API
export type Appointment = components['schemas']['Appointment'] & {
    notes?: string;
};

export type CreateAppointmentDto = components['schemas']['CreateAppointmentDto'];
export type UpdateAppointmentDto = components['schemas']['UpdateAppointmentDto'];
export type DeleteAppointmentsDto = components['schemas']['DeleteAppointmentsDto'];

// Interfaz para la respuesta paginada
export interface PaginatedAppointmentsResponse {
    appointments: Appointment[];
    total: number;
}

// Interfaz para la tabla extendiendo el tipo base
export type AppointmentTableItem = Appointment & { selected?: boolean };

// Configuración para los estados de citas
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | "RESCHEDULED";

export type EnumConfig = {
    name: string;
    backgroundColor: string;
    textColor: string;
    hoverBgColor: string;
    hoverTextColor?: string
    importantBgColor?: string;
    importantHoverBgColor?: string;
    importantTextColor?: string;
    importantHoverTextColor?: string;
    icon: LucideIcon;
}

export type EnumOptions<T> = {
    label: string
    value: T
}

export const appointmentStatusConfig: Record<AppointmentStatus, EnumConfig> = {
    PENDING: {
        name: "Pendiente",
        backgroundColor: "bg-[#FFF8E1]",
        hoverBgColor: "hover:bg-[#FFECB3]",
        textColor: "text-[#FFA000]",
        icon: Clock,
    },
    CONFIRMED: {
        name: "Confirmada",
        backgroundColor: "bg-[#E0F2F1]",
        hoverBgColor: "hover:bg-[#B2DFDB]",
        textColor: "text-[#00796B]",
        icon: CalendarCheck,
    },
    COMPLETED: {
        name: "Completada",
        backgroundColor: "bg-[#E8F5E9]",
        hoverBgColor: "hover:bg-[#C8E6C9]",
        textColor: "text-[#388E3C]",
        icon: CheckCircle,
    },
    CANCELLED: {
        name: "Cancelada",
        backgroundColor: "bg-[#FFEBEE]",
        hoverBgColor: "hover:bg-[#FFCDD2]",
        textColor: "text-[#D32F2F]",
        icon: XCircle,
    },
    NO_SHOW: {
        name: "No asistió",
        backgroundColor: "bg-[#FFF3E0]",
        hoverBgColor: "hover:bg-[#FFE0B2]",
        textColor: "text-[#F57C00]",
        icon: AlertTriangle,
    },
    RESCHEDULED: {
        name: "Reprogramada",
        backgroundColor: "bg-[#F3E5F5]",
        hoverBgColor: "hover:bg-[#CE93D8]",
        textColor: "text-[#8E24AA]",
        icon: RefreshCcw,
    }
}

export const appointmentStatusEnumOptions: EnumOptions<AppointmentStatus>[] = [
    {
        label: "Pendiente",
        value: "PENDING"
    },
    {
        label: "Confirmada",
        value: "CONFIRMED"
    },
    {
        label: "Completada",
        value: "COMPLETED"
    },
    {
        label: "Cancelada",
        value: "CANCELLED"
    },
    {
        label: "No asistió",
        value: "NO_SHOW"
    },
    {
        label: "Reprogramada",
        value: "RESCHEDULED"
    }
];

// Schema de validación para crear cita
export const createAppointmentSchema = z.object({
    staffId: z.string().min(1, "El ID del personal médico es requerido"),
    serviceId: z.string().min(1, "El ID del servicio es requerido"),
    branchId: z.string().min(1, "El ID de la sucursal es requerido"),
    patientId: z.string().min(1, "El ID del paciente es requerido"),
    start: z.string().min(1, "La fecha y hora de inicio son requeridas"),
    end: z.string().min(1, "La fecha y hora de fin son requeridas"),
    type: z.enum(["CONSULTA", "OTRO"]).optional(),
    notes: z.string().optional(),
    paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"])
}) satisfies z.ZodType<CreateAppointmentDto>;

// Schema de validación para actualizar cita
export const updateAppointmentSchema = z.object({
    staffId: z.string().optional(),
    serviceId: z.string().optional(),
    branchId: z.string().optional(),
    patientId: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    type: z.enum(["CONSULTA", "OTRO"]).optional(),
    notes: z.string().optional(),
}) satisfies z.ZodType<UpdateAppointmentDto>;
