"use client";

import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AppointmentStatus, appointmentStatusConfig, appointmentStatusEnumOptions } from '../_interfaces/appointments.interface';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AppointmentStatusFilterProps {
    value: AppointmentStatus | null;
    onChange: (value: AppointmentStatus | null) => void;
    isLoading?: boolean;
}

export const AppointmentStatusFilter: React.FC<AppointmentStatusFilterProps> = ({
    value,
    onChange,
    isLoading = false
}) => {

    // Manejador de cambio en el filtro
    const handleStatusChange = (status: string) => {
        onChange(status as AppointmentStatus);
    };

    // Manejador para limpiar el filtro
    const handleClearFilter = () => {
        onChange(null);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex-grow">
                <Select
                    disabled={isLoading}
                    value={value || ""}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        {appointmentStatusEnumOptions.map((option) => {
                            const statusConfig = appointmentStatusConfig[option.value];
                            const IconComponent = statusConfig.icon;

                            return (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="flex items-center gap-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <IconComponent className="h-4 w-4" />
                                        <span>{option.label}</span>
                                    </div>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearFilter}
                    disabled={isLoading}
                    title="Limpiar filtro"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}

            {isLoading && (
                <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-xs text-muted-foreground">Cargando...</span>
                </div>
            )}

            {value && !isLoading && (
                <Badge
                    className={`${appointmentStatusConfig[value].backgroundColor} ${appointmentStatusConfig[value].textColor}`}
                >
                    {appointmentStatusConfig[value].name}
                </Badge>
            )}
        </div>
    );
};

export default AppointmentStatusFilter; 