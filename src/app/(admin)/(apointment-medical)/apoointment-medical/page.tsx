"use client";

import { AppointmentTable } from "./_components/ApoointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import LoadingCategories from "./loading";
import { METADATA } from "./_statics/metadata";
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth";
import { useAppointment } from "./_hooks/useApointmentMedical";
import { useCallback, useEffect, useState } from "react";
import { AppointmentResponse } from "./_interfaces/apoointments-medical.inteface";

export default function PageAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    useDoctorConfirmedAppointments,
    useBranchConfirmedAppointments,
    useAllConfirmedAppointments,
  } = useAppointment();

  // Determinar el tipo de usuario
  const isSuperAdmin = user?.isSuperAdmin ?? false;
  const isDoctor = user?.roles?.some((role) => role.name === "MEDICO") ?? false;
  const isReceptionist =
    user?.roles?.some((role) => role.name === "ADMINISTRATIVO") ?? false;

  // Consultas condicionadas por rol
  const doctorQuery = isDoctor
    ? useDoctorConfirmedAppointments(user?.id ?? "")
    : { data: undefined, isLoading: false, isError: false, error: null };
  const branchQuery = isReceptionist
    ? useBranchConfirmedAppointments(user?.id ?? "")
    : { data: undefined, isLoading: false, isError: false, error: null };
  const adminQuery = isSuperAdmin
    ? useAllConfirmedAppointments()
    : { data: undefined, isLoading: false, isError: false, error: null };

  // Cargar los datos según el rol del usuario
  useEffect(() => {
    if (!user) {
      setError(new Error("Usuario no autenticado"));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      if (isDoctor && doctorQuery.data) {
        setAppointments(doctorQuery.data);
      } else if (isReceptionist && branchQuery.data) {
        setAppointments(branchQuery.data);
      } else if (isSuperAdmin && adminQuery.data) {
        setAppointments(adminQuery.data);
      }

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error desconocido"));
      setIsLoading(false);
    }
  }, [
    user,
    isDoctor,
    isReceptionist,
    isSuperAdmin,
    doctorQuery.data,
    branchQuery.data,
    adminQuery.data,
  ]);

  // Función para actualizar la lista tras confirmar/marcar no asistencia
  const refreshAppointments = useCallback(() => {
    // Esta función se pasará a la tabla para actualizar los datos
    if (isDoctor && doctorQuery.refetch) {
      doctorQuery.refetch();
    } else if (isReceptionist && branchQuery.refetch) {
      branchQuery.refetch();
    } else if (isSuperAdmin && adminQuery.refetch) {
      adminQuery.refetch();
    }
  }, [
    isDoctor,
    isReceptionist,
    isSuperAdmin,
    doctorQuery,
    branchQuery,
    adminQuery,
  ]);

  if (isLoading) {
    return <LoadingCategories />;
  }

  if (
    error ||
    (isDoctor && doctorQuery.isError) ||
    (isReceptionist && branchQuery.isError) ||
    (isSuperAdmin && adminQuery.isError)
  ) {
    console.error(
      "Error:",
      error ?? doctorQuery.error ?? branchQuery.error ?? adminQuery.error
    );
    notFound();
  }

  if (!appointments.length) {
    // Si no hay citas, mostramos un mensaje adecuado pero no redirigimos a notFound
    return (
      <>
        <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
          <PageHeader
            title={METADATA.title}
            description={METADATA.description}
          />
        </div>
        <div className="flex items-center justify-center p-8">
          <p className="text-lg text-gray-500">No hay citas disponibles</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader title={METADATA.title} description={METADATA.description} />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <AppointmentTable
          data={appointments}
          userRole={{
            isSuperAdmin,
            isDoctor,
            isReceptionist,
          }}
          userId={user?.id}
          onRefresh={refreshAppointments}
        />
      </div>
    </>
  );
}
