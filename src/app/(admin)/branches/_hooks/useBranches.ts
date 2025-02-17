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
      const response = await getBranches({});
      
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
      const response = await deleteBranches(data);
      
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Branch[]>(["branches"], (oldBranches) => {
        if (!oldBranches) {
          return [];
        }
        const updatedBranches = oldBranches.map((branch) => {
          if (variables.ids.includes(branch.id)) {
            return { ...branch, isActive: false };
          }
          return branch;
        });
        return updatedBranches;
      });

      toast.success(
        variables.ids.length === 1
          ? "Sucursal desactivada exitosamente"
          : "Sucursales desactivadas exitosamente"
      );
    },
    onError: (error) => {
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
      const response = await reactivateBranches(data);
      
      if ("error" in response) {;
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Branch[]>(["branches"], (oldBranches) => {
        if (!oldBranches) {
          return [];
        }
        const updatedBranches = oldBranches.map((branch) => {
          if (variables.ids.includes(branch.id)) {
            return { ...branch, isActive: true };
          }
          return branch;
        });
        return updatedBranches;
      });

      toast.success(
        variables.ids.length === 1
          ? "Sucursal reactivada exitosamente"
          : "Sucursales reactivadas exitosamente"
      );
    },
    onError: (error) => {
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
