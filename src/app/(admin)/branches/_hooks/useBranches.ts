import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createBranch,
  updateBranch,
  deleteBranches,
  getBranches,
  reactivateBranches,
  getActiveBranches,
} from "../_actions/branch.actions";
import { toast } from "sonner";
import {
  Branch,
  CreateBranchDto,
  UpdateBranchDto,
  DeleteBranchesDto,
} from "../_interfaces/branch.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateBranchVariables {
  id: string;
  data: UpdateBranchDto;
}

export const useBranches = () => {
  const queryClient = useQueryClient();

  // Query para obtener las branches
  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      console.log("🔄 Iniciando branchesQuery");
      const response = await getBranches({});
      console.log("📥 Respuesta raw de getBranches:", response);
      
      if (!response) {
        console.error("❌ No hay respuesta de getBranches");
        throw new Error("No se recibió respuesta del servidor");
      }

      if (response.error || !response.data) {
        console.error("❌ Error en branchesQuery:", { error: response.error, data: response.data });
        throw new Error(response.error ?? "Error desconocido");
      }

      console.log("✅ Datos procesados correctamente:", response.data);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

    // Query para obtener las branches activas
    const activeBranchesQuery = useQuery({
      queryKey: ["active-branches"],
      queryFn: async () => {
        const response = await getActiveBranches({});
        if (!response) {
          throw new Error("No se recibió respuesta del servidor");
        }
        if (response.error || !response.data) {
          throw new Error(response.error ?? "Error desconocido");
        }
        return response.data;
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
    });

  // Mutación para crear sucursal
  const createMutation = useMutation<BaseApiResponse<Branch>, Error, CreateBranchDto>({
    mutationFn: async (data) => {
      const response = await createBranch(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      // Retornamos directamente la respuesta ya que viene en el formato correcto
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Branch[]>(["branches"], (oldBranches) => {
        if (!oldBranches) return [res.data];
        return [...oldBranches, res.data];
      });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Mutación para actualizar sucursal
  const updateMutation = useMutation<BaseApiResponse<Branch>, Error, UpdateBranchVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateBranch(id, data);
      
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Branch[]>(["branches"], (oldBranches) => {
        if (!oldBranches) {
          return [res.data];
        }
        const updatedBranches = oldBranches.map((branch) =>
          branch.id === res.data.id ? res.data : branch
        );
        return updatedBranches;
      });
      toast.success("Sucursal actualizada exitosamente");
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar la sucursal");
      }
    },
  });

  // Mutación para eliminar sucursales
  const deleteMutation = useMutation<BaseApiResponse<Branch>, Error, DeleteBranchesDto>({
    mutationFn: async (data) => {
      console.log("🚀 Iniciando deleteMutation con:", data);
      const response = await deleteBranches(data);
      console.log("📥 Respuesta de deleteBranches:", response);
      
      if ("error" in response) {
        console.error("❌ Error en deleteBranches:", response.error);
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      console.log("✅ Eliminación exitosa:", res);
      queryClient.setQueryData<Branch[]>(["branches"], (oldBranches) => {
        console.log("🔄 Cache actual:", oldBranches);
        if (!oldBranches) {
          console.log("⚠️ No hay branches en caché");
          return [];
        }
        const updatedBranches = oldBranches.map((branch) => {
          if (variables.ids.includes(branch.id)) {
            return { ...branch, isActive: false };
          }
          return branch;
        });
        console.log("📦 Nueva caché:", updatedBranches);
        return updatedBranches;
      });

      toast.success(
        variables.ids.length === 1
          ? "Sucursal desactivada exitosamente"
          : "Sucursales desactivadas exitosamente"
      );
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar la(s) sucursal(es)");
      }
    },
  });

  // Mutación para reactivar sucursales
  const reactivateMutation = useMutation<BaseApiResponse<Branch>, Error, DeleteBranchesDto>({
    mutationFn: async (data) => {
      console.log("🚀 Iniciando reactivateMutation con:", data);
      const response = await reactivateBranches(data);
      console.log("📥 Respuesta de reactivateBranches:", response);
      
      if ("error" in response) {
        console.error("❌ Error en reactivateBranches:", response.error);
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      console.log("✅ Reactivación exitosa:", res);
      queryClient.setQueryData<Branch[]>(["branches"], (oldBranches) => {
        console.log("🔄 Cache actual:", oldBranches);
        if (!oldBranches) {
          console.log("⚠️ No hay branches en caché");
          return [];
        }
        const updatedBranches = oldBranches.map((branch) => {
          if (variables.ids.includes(branch.id)) {
            return { ...branch, isActive: true };
          }
          return branch;
        });
        console.log("📦 Nueva caché:", updatedBranches);
        return updatedBranches;
      });

      toast.success(
        variables.ids.length === 1
          ? "Sucursal reactivada exitosamente"
          : "Sucursales reactivadas exitosamente"
      );
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar la(s) sucursal(es)");
      }
    },
  });

  return {
    branchesQuery,
    activeBranchesQuery,
    branches: branchesQuery.data,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
