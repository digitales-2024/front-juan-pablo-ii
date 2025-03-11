"use client";

import { AppointmentTable } from "./_components/ApoointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import LoadingCategories from "./loading";
import { METADATA } from "./_statics/metadata";
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth";
import { useAppointment } from "./_hooks/useApointmentMedical";
import {  useEffect, useState } from "react";
import { AppointmentResponse } from "./_interfaces/apoointments-medical.inteface";
import { CalendarClock, Stethoscope, Users } from "lucide-react"; // Importamos algunos iconos

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
    : {
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        refetch: () => Promise.resolve(),
      };
  const branchQuery = isReceptionist
    ? useBranchConfirmedAppointments(user?.id ?? "")
    : {
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        refetch: () => Promise.resolve(),
      };
  const adminQuery = isSuperAdmin
    ? useAllConfirmedAppointments()
    : {
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        refetch: () => Promise.resolve(),
      };

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

  // Mensaje mejorado para cuando no hay citas
  if (!appointments.length) {
    return (
      <>
        <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
          <PageHeader
            title={METADATA.title}
            description={METADATA.description}
          />
        </div>
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-100 mt-4">
          <div className="p-6 bg-sky-50 rounded-full mb-6">
            <CalendarClock className="h-12 w-12 text-sky-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No hay citas programadas
          </h2>
          <p className="text-gray-500 text-center max-w-md mb-6">
            {isDoctor
              ? "Actualmente no tienes citas médicas programadas para atender."
              : "No se encontraron citas programadas en el sistema."}
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-2">
            <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
              <Stethoscope className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="text-emerald-700">Consulta médica</span>
            </div>
            <div className="flex items-center p-3 bg-amber-50 rounded-lg">
              <Users className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-amber-700">Atención a pacientes</span>
            </div>
          </div>
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
        />
      </div>
    </>
  );
}
