"use client";

import { AppointmentTable } from "./_components/ApoointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import LoadingCategories from "./loading";
import { METADATA } from "./_statics/metadata";
import { useAppointmentComplete } from "./_hooks/useApointmentMedical";
import { useState, useCallback, useEffect, useRef } from "react";
import { CalendarClock, Stethoscope, Users } from "lucide-react";
import { toast } from "sonner";

export default function PageAppointmentsComplete() {
  const { useRoleBasedCompletedAppointments } = useAppointmentComplete();
  const {
    data: appointments = [],
    isLoading: isQueryLoading,
    isError,
    error,
    refetch,
    userRole,
    userId
  } = useRoleBasedCompletedAppointments();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const initialLoadDone = useRef(false);
  const [isDataReady, setIsDataReady] = useState(false);

  // Combinar estados de carga para mejor UX
  const isLoading = isQueryLoading || isRefreshing || !isDataReady;

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return; // Evitar solicitudes múltiples
    setIsRefreshing(true);
    setIsDataReady(false);
    
    try {
      void refetch().then((result) => {
        const successMessage = userRole.isDoctor 
          ? "Citas médicas completadas actualizadas" 
          : userRole.isReceptionist 
            ? "Citas médicas completadas actualizadas" 
            : "Citas médicas completadas actualizadas";
        
        // Pequeño retraso para asegurar que la UI esté lista antes de mostrar los datos
        setTimeout(() => {
          setIsDataReady(true);
          setIsRefreshing(false);
          
          // Solo mostramos el mensaje de éxito si hay datos o si es la carga inicial
          if (result.data && result.data.length > 0 || !initialLoadDone.current) {
            toast.success(successMessage);
          }
        }, 300);
      });
    } catch (err) {
      console.error("Error al refrescar datos:", err);
      toast.error("Error al actualizar los datos");
      setIsRefreshing(false);
      setIsDataReady(true);
    }
  }, [refetch, userRole, isRefreshing]);

  // Efecto para la carga inicial ÚNICA
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      handleRefresh();
    }
  }, [handleRefresh]);

  // Efecto separado SOLO para visibilityChange
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Página visible, actualizando datos...');
        handleRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleRefresh]);

  // Cuando los datos iniciales están disponibles pero aún no marcados como listos
  useEffect(() => {
    if (!isQueryLoading && !isRefreshing && !isDataReady && appointments) {
      setIsDataReady(true);
    }
  }, [isQueryLoading, isRefreshing, appointments, isDataReady]);

  if (isLoading) {
    return <LoadingCategories />;
  }

  if (isError) {
    console.error("Error:", error);
    notFound();
  }

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
            {userRole.isDoctor
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
            isSuperAdmin: userRole.isAdmin,
            isDoctor: userRole.isDoctor,
            isReceptionist: userRole.isReceptionist,
          }}
          userId={userId}
          onRefresh={handleRefresh}
        />
      </div>
    </>
  );
}