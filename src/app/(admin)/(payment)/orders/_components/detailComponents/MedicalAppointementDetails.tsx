import React from "react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Clipboard } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { MedicalAppointmentOrderDetails } from "../../_interfaces/order.interface";
import { useServices } from "@/app/(admin)/services/_hooks/useServices";
import { Service } from "@/app/(admin)/services/_interfaces/service.interface";
import { UseQueryResult } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface MedicalAppointmentDetailsProps {
  details: MedicalAppointmentOrderDetails;
}

const MedicalAppointmentDetails: React.FC<MedicalAppointmentDetailsProps> = ({
  details,
}) => {
  const { useOneServiceQuery } = useServices();
  let serviceData: UseQueryResult<Service | undefined, Error> | undefined =
    undefined;

    if (details.serviceId) {
        serviceData = useOneServiceQuery(details.serviceId);
    }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    try {
      return format(parseISO(dateString), "PPP", { locale: es });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "No disponible";
    try {
      return format(parseISO(timeString), "HH:mm");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return timeString;
    }
  };

  if (serviceData?.isLoading) {
    return (
      <div className="flex rounded-sm bg-primary/10 p-4 w-fit space-x-4 items-start !mt-0">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-20 h-20 rounded-full" />
      </div>
    );
  }

    if (serviceData?.isError) {
        return (
        <div className="flex rounded-sm bg-primary/10 p-4 w-fit space-x-4 items-start !mt-0">
            Error
        </div>
        );
    }

    if (!serviceData?.data) {
        return (
        <div className="flex rounded-sm bg-primary/10 p-4 w-fit space-x-4 items-start !mt-0">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="w-20 h-20 rounded-full" />
        </div>
        );
    }

  return (
    <div className="flex rounded-sm bg-primary/10 p-4 w-fit space-x-4 items-start !mt-0">
        <div className="flex space-x-2">
        <div className="flex flex-col gap-1 justify-center items-start">
          <Calendar className="text-primary" />
          <Label className="text-sm font-medium">Nombre del servicio</Label>
          <span className="text-sm text-muted-foreground">
            {serviceData.data.name ?? "No especificado"}
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <div className="flex flex-col gap-1 justify-center items-start">
          <Calendar className="text-primary" />
          <Label className="text-sm font-medium">Fecha consulta</Label>
          <span className="text-sm text-muted-foreground">
            {formatDate(details.consultationDate)}
          </span>
        </div>
      </div>

      <Separator orientation="vertical" />

      <div className="flex space-x-2">
        <div className="flex flex-col gap-1 justify-center items-start">
          <Clock className="text-primary" />
          <Label className="text-sm font-medium">Horario</Label>
          <span className="text-sm text-muted-foreground">
            {formatTime(details.appointmentStart)} -{" "}
            {formatTime(details.appointmentEnd)}
          </span>
        </div>
      </div>

      <Separator orientation="vertical" />

      <div className="flex space-x-2">
        <div className="flex flex-col gap-1 justify-center items-start">
          <Clipboard className="text-primary" />
          <Label className="text-sm font-medium">Tipo de consulta</Label>
          <span className="text-sm text-muted-foreground">
            {details.appointmentType ?? "No especificado"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MedicalAppointmentDetails;
