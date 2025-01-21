import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createBranch,
  updateBranch,
  deleteBranches,
  getBranches,
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
  const updateMutation = useMutation<Branch, Error, UpdateBranchVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateBranch(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (updatedBranch) => {
      queryClient.setQueryData<Branch[]>(["branches"], (oldBranches) => {
        if (!oldBranches) return [updatedBranch];
        return oldBranches.map((branch) =>
          branch.id === updatedBranch.id ? updatedBranch : branch
        );
      });

      toast.success("Sucursal actualizada exitosamente");
    },
    onError: (error: Error) => {
      if (
        error.message.includes("no autorizado") ||
        error.message.includes("sesión expirada")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message);
      }
    },
  });

  // Mutación para eliminar sucursales
  const deleteMutation = useMutation<void, Error, DeleteBranchesDto>({
    mutationFn: async (data) => {
      const response = await deleteBranches(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Branch[]>(["branches"], (oldBranches) => {
        if (!oldBranches) return [];
        return oldBranches.filter(
          (branch) => !variables.ids.includes(branch.id)
        );
      });

      toast.success(
        variables.ids.length === 1
          ? "Sucursal eliminada exitosamente"
          : "Sucursales eliminadas exitosamente"
      );
    },
    onError: (error: Error) => {
      if (
        error.message.includes("no autorizado") ||
        error.message.includes("sesión expirada")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message);
      }
    },
  });

  return {
    branchesQuery,
    branches: branchesQuery.data,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
