import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createStaff,
  updateStaff,
  deleteStaff,
  getStaff,
  reactivateStaff,
  getACtiveStaff,
  getStaffById,
} from "../_actions/staff.actions";
import { toast } from "sonner";
import {
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  DeleteStaffDto,
} from "../_interfaces/staff.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateStaffVariables {
  id: string;
  data: UpdateStaffDto;
}

export const useStaff = () => {
  const queryClient = useQueryClient();

  // Query para obtener el personal
  const staffQuery = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await getStaff({});

      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      if (response.error || !response.data) {
        throw new Error(response.error ?? "Error desconocido");
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true, // Recargar datos cuando la ventana obtiene el foco
    refetchOnMount: true, // Recargar datos cuando el componente se monta
  });

  // Query para obtener el personal activo
  const activeStaffQuery = useQuery({
    queryKey: ["active-staff"],
    queryFn: async () => {
      const response = await getACtiveStaff({});

      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      if (response.error || !response.data) {
        throw new Error(response.error ?? "Error desconocido");
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true, // Recargar datos cuando la ventana obtiene el foco
    refetchOnMount: true, // Recargar datos cuando el componente se monta
  });

  const oneStaffQuery = (id: string) =>
    useQuery<Staff, Error>({
      queryKey: ["staff", id],
      queryFn: async () => {
        try {
          const response = await getStaffById(id);
          if ("error" in response) {
            throw new Error(response.error);
          }
          if (!response) {
            throw new Error("No se encontró el personal");
          }
          return response;
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Error desconocido al traer personal";
          toast.error(message);
          throw new Error(message);
        }
      },
      enabled: !!id,
      refetchOnWindowFocus: true, // Recargar datos cuando la ventana obtiene el foco
      refetchOnMount: true, // Recargar datos cuando el componente se monta
    });

  // Mutación para crear personal
  const createMutation = useMutation<
    BaseApiResponse<Staff>,
    Error,
    CreateStaffDto
  >({
    mutationFn: async (data) => {
      const response = await createStaff(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) => {
        if (!oldStaff) return [res.data];
        return [...oldStaff, res.data];
      });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutación para actualizar personal
  const updateMutation = useMutation<
    BaseApiResponse<Staff>,
    Error,
    UpdateStaffVariables
  >({
    mutationFn: async ({ id, data }) => {
      console.log("🚀 ~ mutationFn: ~ id:", id);
      console.log("🚀 ~ mutationFn: ~ data:", data);

      // Asegurarse de que los campos críticos estén definidos correctamente
      const processedData = { ...data };

      // Asegurarse de que userId, cmp y branchId se manejen correctamente
      if (processedData.userId === undefined) {
        processedData.userId = "";
      }

      if (processedData.cmp === undefined) {
        processedData.cmp = "";
      }

      if (processedData.branchId === undefined) {
        processedData.branchId = "";
      }

      console.log("🚀 ~ mutationFn: ~ processedData:", processedData);

      const response = await updateStaff(id, processedData);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      // Actualizar la caché para la lista de personal
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) => {
        if (!oldStaff) return [res.data];
        return oldStaff.map((staff) =>
          staff.id === res.data.id ? res.data : staff
        );
      });

      // Actualizar la caché para la lista de personal activo
      queryClient.setQueryData<Staff[]>(["active-staff"], (oldStaff) => {
        if (!oldStaff) return [res.data];
        return oldStaff.map((staff) =>
          staff.id === res.data.id ? res.data : staff
        );
      });

      // Actualizar la caché para el personal individual
      queryClient.setQueryData(["staff", res.data.id], res.data);

      // Invalidar las consultas relacionadas para forzar una recarga si es necesario
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["active-staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff", res.data.id] });

      toast.success("Personal actualizado exitosamente");
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el personal");
      }
    },
  });

  // Mutación para eliminar personal
  const deleteMutation = useMutation<
    BaseApiResponse<Staff>,
    Error,
    DeleteStaffDto
  >({
    mutationFn: async (data) => {
      const response = await deleteStaff(data);

      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) => {
        if (!oldStaff) return [];
        return oldStaff.map((staff) => {
          if (variables.ids.includes(staff.id)) {
            return { ...staff, isActive: false };
          }
          return staff;
        });
      });

      toast.success(
        variables.ids.length === 1
          ? "Personal desactivado exitosamente"
          : "Personal desactivado exitosamente"
      );
    },
    onError: (error) => {
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el personal");
      }
    },
  });

  // Mutación para reactivar personal
  const reactivateMutation = useMutation<
    BaseApiResponse<Staff>,
    Error,
    DeleteStaffDto
  >({
    mutationFn: async (data) => {
      const response = await reactivateStaff(data);

      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) => {
        if (!oldStaff) return [];
        return oldStaff.map((staff) => {
          if (variables.ids.includes(staff.id)) {
            return { ...staff, isActive: true };
          }
          return staff;
        });
      });

      toast.success(
        variables.ids.length === 1
          ? "Personal reactivado exitosamente"
          : "Personal reactivado exitosamente"
      );
    },
    onError: (error) => {
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el personal");
      }
    },
  });

  return {
    staffQuery,
    activeStaffQuery,
    staff: staffQuery.data,
    oneStaffQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
