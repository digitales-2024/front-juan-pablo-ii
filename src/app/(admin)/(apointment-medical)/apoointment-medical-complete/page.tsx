"use client";

import { AppointmentTable } from "./_components/ApoointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import LoadingCategories from "./loading";
import { METADATA } from "./_statics/metadata";
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth";
import { useAppointment } from "./_hooks/useApointmentMedical";
import { useEffect, useState, useCallback } from "react";
import { AppointmentResponse } from "./_interfaces/apoointments-medical.inteface";
import { CalendarClock, Stethoscope, Users } from "lucide-react";
import { toast } from "sonner";

export default function PageAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mejoramos la detección de roles
  const isSuperAdmin = user?.isSuperAdmin === true;
  const isSuperAdminRole = user?.roles?.some(role => role.name === "SUPER_ADMIN") ?? false;
  const isDoctor = user?.roles?.some(role => role.name === "MEDICO") ?? false;
  const isReceptionist = user?.roles?.some(role => role.name === "ADMINISTRATIVO") ?? false;
  
  // Determinamos definitivamente si es admin (cualquiera de las dos formas)
  const isAdmin = isSuperAdmin || isSuperAdminRole;

  const {
    useDoctorConfirmedAppointments,
    useBranchConfirmedAppointments,
    useAllConfirmedAppointments,
  } = useAppointment();

  // Obtenemos los datos con los hooks correspondientes
  const doctorData = useDoctorConfirmedAppointments(user?.id ?? "");
  const branchData = useBranchConfirmedAppointments(user?.id ?? "");
  const adminData = useAllConfirmedAppointments(); // No requiere ID

  // Función mejorada para refrescar datos
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    
    try {
      if (isDoctor) {
        void doctorData.refetch().then(response => {
          if (response?.data) {
            setAppointments(response.data);
            toast.success("Citas del médico actualizadas");
          }
          setIsLoading(false);
        });
      } else if (isReceptionist) {
        void branchData.refetch().then(response => {
          if (response?.data) {
            setAppointments(response.data);
            toast.success("Citas de la sucursal actualizadas");
          }
          setIsLoading(false);
        });
      } else if (isAdmin) {
        void adminData.refetch().then(response => {
          if (response?.data) {
            setAppointments(response.data);
            toast.success("Todas las citas actualizadas");
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
        toast.error("No se pudo determinar el rol del usuario");
      }
    } catch (err) {
      console.error("Error al refrescar datos:", err);
      toast.error("Error al actualizar los datos");
      setIsLoading(false);
    }
  }, [isDoctor, isReceptionist, isAdmin, doctorData, branchData, adminData]);

  useEffect(() => {
    if (!user) {
      setError(new Error("Usuario no autenticado"));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      if (isDoctor) {
        setAppointments(doctorData.data ?? []);
      } else if (isReceptionist) {
        setAppointments(branchData.data ?? []);
      } else if (isAdmin) { // Cambiamos a isAdmin
        setAppointments(adminData.data ?? []);
      } else {
        // Si no tiene ningún rol reconocido
        console.warn("Usuario sin rol reconocido:", user);
        setAppointments([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error desconocido"));
    } finally {
      setIsLoading(false);
    }
  }, [
    user,
    isDoctor, isReceptionist, isAdmin, // Cambiamos a isAdmin
    doctorData.data, branchData.data, adminData.data,
  ]);

  if (isLoading) {
    return <LoadingCategories />;
  }

  if (
    error ||
    (isDoctor && doctorData.isError) ||
    (isReceptionist && branchData.isError) ||
    (isAdmin && adminData.isError)
  ) {
    console.error(
      "Error:",
      error ?? doctorData.error ?? branchData.error ?? adminData.error
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
            isSuperAdmin: isAdmin, // Pasamos isAdmin como isSuperAdmin
            isDoctor,
            isReceptionist,
          }}
          userId={user?.id}
          onRefresh={handleRefresh}
        />
      </div>
    </>
  );
}
