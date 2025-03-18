"use client";

import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAppointments } from '../_hooks/useAppointments';
import { Appointment, AppointmentStatus, appointmentStatusConfig } from '../_interfaces/appointments.interface';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import AppointmentStatusFilter from './AppointmentStatusFilter';

// Componente simple de paginación
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    disabled
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean
}) => {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || disabled}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Anterior
            </Button>
            <span className="text-sm">
                Página {currentPage} de {totalPages || 1}
            </span>
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages || disabled}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Siguiente
            </Button>
        </div>
    );
};

export const AppointmentsTable: React.FC = () => {
    const {
        paginatedAppointmentsQuery,
        appointmentsByStatusQuery,
        pagination,
        setPagination,
        statusFilter,
        setStatusFilter,
    } = useAppointments();

    // Determinar qué datos mostrar basados en si hay un filtro activo
    const isFilterActive = !!statusFilter;
    const currentQuery = isFilterActive ? appointmentsByStatusQuery : paginatedAppointmentsQuery;
    const isLoading = currentQuery.isLoading;
    const data = currentQuery.data;

    // Obtener las citas y el total según si hay filtro o no
    const appointments = data?.appointments || [];
    const total = data?.total || 0;

    // Calcular el número total de páginas
    const totalPages = Math.ceil(total / pagination.limit);

    // Manejar cambio de página
    const handlePageChange = (page: number) => {
        setPagination({ ...pagination, page });
    };

    // Renderizar estado de la cita con estilo y color según el tipo
    const renderStatus = (status: AppointmentStatus) => {
        const config = appointmentStatusConfig[status];
        if (!config) {
            return <Badge>Desconocido</Badge>;
        }

        const StatusIcon = config.icon;

        return (
            <Badge className={`${config.backgroundColor} ${config.textColor} flex items-center gap-1`}>
                <StatusIcon className="h-3.5 w-3.5" />
                <span>{config.name}</span>
            </Badge>
        );
    };

    // Renderizar fila de la tabla
    const renderAppointmentRow = (appointment: Appointment) => {
        const startDate = new Date(appointment.start);
        const formattedDate = format(startDate, 'dd MMM yyyy', { locale: es });
        const formattedTime = format(startDate, 'HH:mm', { locale: es });

        return (
            <TableRow key={appointment.id}>
                <TableCell className="font-medium">
                    {appointment.patient?.name} {appointment.patient?.lastName}
                </TableCell>
                <TableCell>{appointment.patient?.dni}</TableCell>
                <TableCell>
                    {appointment.staff?.name} {appointment.staff?.lastName}
                </TableCell>
                <TableCell>{appointment.service?.name}</TableCell>
                <TableCell>{appointment.branch?.name}</TableCell>
                <TableCell className="whitespace-nowrap">
                    {formattedDate}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                    {formattedTime}
                </TableCell>
                <TableCell>
                    {renderStatus(appointment.status as AppointmentStatus)}
                </TableCell>
                <TableCell>
                    <Button size="sm" variant="outline">
                        Ver detalles
                    </Button>
                </TableCell>
            </TableRow>
        );
    };

    // Renderizar filas de carga cuando está cargando
    const renderSkeletonRows = () => {
        return Array(pagination.limit).fill(0).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-8 w-24" /></TableCell>
            </TableRow>
        ));
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle>Citas Médicas</CardTitle>
                        <CardDescription>
                            Gestiona todas las citas médicas programadas
                        </CardDescription>
                    </div>
                    <div className="w-full md:w-72">
                        <AppointmentStatusFilter
                            value={statusFilter}
                            onChange={setStatusFilter}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Paciente</TableHead>
                                <TableHead>DNI</TableHead>
                                <TableHead>Médico</TableHead>
                                <TableHead>Servicio</TableHead>
                                <TableHead>Sucursal</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Hora</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? renderSkeletonRows()
                                : appointments.length > 0
                                    ? appointments.map(renderAppointmentRow)
                                    : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                                No se encontraron citas
                                                {statusFilter && (
                                                    <> con estado <strong>{appointmentStatusConfig[statusFilter]?.name || 'Desconocido'}</strong></>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                            }
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    {total > 0 ? (
                        <>Mostrando {Math.min(pagination.limit, appointments.length)} de {total} resultados</>
                    ) : (
                        'No hay resultados'
                    )}
                </div>
                <Pagination
                    currentPage={pagination.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    disabled={isLoading}
                />
            </CardFooter>
        </Card>
    );
};

export default AppointmentsTable; 