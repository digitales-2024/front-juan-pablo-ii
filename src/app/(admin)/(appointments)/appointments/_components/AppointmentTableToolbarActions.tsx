import { Table } from '@tanstack/react-table';
import { Appointment } from '../_interfaces/appointments.interface';
// import { DeactivateAppointmentDialog } from './DeactivateAppointmentDialog';
// import { ReactivateAppointmentDialog } from './ReactivateAppointmentDialog';
import { Button } from "@/components/ui/button";
// import { CreateAppointmentDialog } from './CreateAppointmentDialog';

export interface AppointmentTableToolbarActionsProps {
    table?: Table<Appointment>;
}

export function AppointmentTableToolbarActions({
    table,
}: AppointmentTableToolbarActionsProps) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    {/* <DeactivateAppointmentDialog
                        appointments={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    <ReactivateAppointmentDialog
                        appointments={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    /> */}
                </>
            ) : null}
            <Button
                onClick={() => window.location.href = '/consultations'}
                className="default"
            >
                Crear Cita
            </Button>
            {/* <CreateAppointmentDialog /> */}
        </div>
    );
} 