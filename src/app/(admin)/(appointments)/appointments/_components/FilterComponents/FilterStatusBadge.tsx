"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AppointmentStatus, appointmentStatusConfig } from "../../_interfaces/appointments.interface";
import { useFilterAppointments } from "../../_hooks/useFilterAppointments";
import { AppointmentsFilterType } from "../../_interfaces/filter.interface";
import { cn } from "@/lib/utils";

export const FilterStatusBadge = () => {
    const {
        filterType,
        statusFilter,
        setFilterAllAppointments
    } = useFilterAppointments();

    // Si no hay filtro activo, no mostramos nada
    if (filterType === AppointmentsFilterType.ALL || !statusFilter) {
        return null;
    }

    const statusConfig = appointmentStatusConfig[statusFilter];
    const StatusIcon = statusConfig?.icon;

    return (
        <div className="flex items-center py-2 mb-2">
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                <span className="text-sm font-medium">Filtro activo:</span>
                <Badge
                    className={cn(
                        statusConfig?.backgroundColor,
                        statusConfig?.textColor,
                        "flex items-center gap-1 px-2 py-1"
                    )}
                >
                    {StatusIcon && <StatusIcon className="h-3.5 w-3.5 mr-1" />}
                    <span className="font-medium">{statusConfig?.name || statusFilter}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1 hover:bg-opacity-20 rounded-full"
                        onClick={() => setFilterAllAppointments()}
                        title="Quitar filtro"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </Badge>
            </div>
        </div>
    );
};

export default FilterStatusBadge; 