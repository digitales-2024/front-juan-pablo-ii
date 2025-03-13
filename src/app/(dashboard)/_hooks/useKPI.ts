import { useQuery } from "@tanstack/react-query";
import {
  getPatientsSucursalKPI,
  getCitasPorSucursalKPI,
  getTopServicesBySucursalKPI,
  getCotizacionesPorEstadoKPI,
  getIngresosPorSucursalKPI,
  getKpiCardsDataKPI,
} from "../_actions/KPI.actions";
import { PacientesPorSucursalData } from "../_interfaces/KPI.interface";
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth";

export const useKPI = () => {
  // Obtener información del usuario autenticado
  const { user } = useAuth();
  
  // Determinar el rol del usuario
  const isSuperAdmin = user?.isSuperAdmin === true;
  const isSuperAdminRole = user?.roles?.some(role => role.name === "SUPER_ADMIN") ?? false;
  const isDoctor = user?.roles?.some(role => role.name === "MEDICO") ?? false;
  const isReceptionist = user?.roles?.some(role => role.name === "ADMINISTRATIVO") ?? false;
  const isAdmin = isSuperAdmin || isSuperAdminRole;

  // Banderas de permiso según el rol
  const canAccessFullDashboard = isAdmin;
  const canAccessPartialDashboard = isReceptionist || isDoctor;

  /**
   * Hook para obtener y gestionar los datos de pacientes por sucursal
   * @param year Año opcional para filtrar los datos
   * @returns Objeto con datos, estados de carga y errores
   */
  const usePacientesPorSucursal = (year?: number) => {
    return useQuery<PacientesPorSucursalData, Error>({
      queryKey: ["pacientes-por-sucursal", year],
      queryFn: async () => {
        const response = await getPatientsSucursalKPI({ year });

        if (response.error || !response.data) {
          throw new Error(response.error ?? "No se pudieron obtener los datos");
        }

        return response.data;
      },
      staleTime: 1000 * 60 * 5, // 5 minutos de caché fresca
      refetchOnWindowFocus: false, // No recargar al enfocar la ventana
      enabled: canAccessFullDashboard, // Solo disponible para admin
    });
  };

  /**
   * Hook para obtener datos de citas por sucursal
   */
  const useCitasPorSucursal = () => {
    return useQuery<PacientesPorSucursalData, Error>({
      queryKey: ["citas-por-sucursal"],
      queryFn: async () => {
        const response = await getCitasPorSucursalKPI();

        if (response.error || !response.data) {
          throw new Error(response.error ?? "No se pudieron obtener los datos");
        }

        return response.data;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      enabled: canAccessFullDashboard, // Solo disponible para admin
    });
  };

  /**
   * Hook para obtener los 12 servicios más demandados por sucursal
   */
  interface TopServiciosData {
    serviceName: string;
    JLBYR: number;
    Yanahuara: number;
  }
  const useTopServicesPorSucursal = () => {
    return useQuery<TopServiciosData[], Error>({
      queryKey: ["top-servicios-por-sucursal"],
      queryFn: async () => {
        const response = await getTopServicesBySucursalKPI();

        if (response.error || !response.data) {
          throw new Error(response.error ?? "No se pudieron obtener los datos");
        }

        return response.data;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      enabled: canAccessFullDashboard, // Solo disponible para admin
    });
  };

  /**
   * Hook para obtener cotizaciones por estado
   */
  interface CotizacionesPorEstadoData {
    month: string;
    pendientes: number;
    pagadas: number;
  }

  const useCotizacionesPorEstado = () => {
    return useQuery<CotizacionesPorEstadoData[], Error>({
      queryKey: ["cotizaciones-por-estado"],
      queryFn: async () => {
        const response = await getCotizacionesPorEstadoKPI();

        if (response.error || !response.data) {
          throw new Error(response.error ?? "No se pudieron obtener los datos");
        }

        return response.data;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      enabled: canAccessFullDashboard, // Solo disponible para admin
    });
  };

  /**
   * Hook para obtener ingresos por sucursal
   */
  interface IngresosPorSucursalData {
    date: string;
    [sucursal: string]: number | string;
  }

  interface IngresosSucursalesResponse {
    ingresos: IngresosPorSucursalData[];
    sucursales: string[];
  }
  const useIngresosPorSucursal = () => {
    return useQuery<IngresosSucursalesResponse, Error>({
      queryKey: ["ingresos-por-sucursal"],
      queryFn: async () => {
        const response = await getIngresosPorSucursalKPI();

        if (response.error || !response.data) {
          throw new Error(response.error ?? "No se pudieron obtener los datos");
        }

        return response.data;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      enabled: canAccessFullDashboard, // Solo disponible para admin
    });
  };

  /**
   * Hook para obtener datos de KPI Cards
   */
  interface KpiCardsData {
    totalIngresos: number;
    ingresoPromedio: number;
    totalPacientes: number;
    citasCompletadas: number;
    citasPendientes: number;
  }
  const useKpiCardsData = () => {
    return useQuery<KpiCardsData, Error>({
      queryKey: ["kpi-cards-data"],
      queryFn: async () => {
        const response = await getKpiCardsDataKPI();

        if (response.error || !response.data) {
          throw new Error(response.error ?? "No se pudieron obtener los datos");
        }

        return response.data;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  return {
    // Queries
    usePacientesPorSucursal,
    useCitasPorSucursal,
    useTopServicesPorSucursal,
    useCotizacionesPorEstado,
    useIngresosPorSucursal,
    useKpiCardsData,
    
    // Información de permisos para el componente
    canAccessFullDashboard,
    canAccessPartialDashboard,
    userRole: { isAdmin, isReceptionist, isDoctor }
  };
};
