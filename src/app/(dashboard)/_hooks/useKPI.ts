import { useQuery } from "@tanstack/react-query";
import { getPatientsSucursalKPI, getCitasPorSucursalKPI } from "../_actions/KPI.actions";
import { PacientesPorSucursalData } from "../_interfaces/KPI.interface";

export const useKPI = () => {
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
      staleTime: 1000 * 60 * 5, // 5 minutos de caché fresca
      refetchOnWindowFocus: false, // No recargar al enfocar la ventana
    });
  };

  return {
    // Queries
    usePacientesPorSucursal,
    useCitasPorSucursal,
  };
};
