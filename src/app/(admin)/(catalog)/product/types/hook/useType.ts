import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTypeProduct,
  deleteTypeProduct,
  reactivateTypeProduct,
  updateTypeProduct,
} from "../actions";
import { toast } from "sonner";
import {
  CreateTypeProductDto,
  UpdateTypeProductDto,
  ReactivateTypeProductDto,
  DeleteTypeProductDto,
  TypeProductResponse,
} from "../types";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateTypeProductVariables {
  id: string;
  data: UpdateTypeProductDto;
}

export const useTypeProducts = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    BaseApiResponse<CreateTypeProductDto>,
    Error,
    CreateTypeProductDto
  >({
    mutationFn: async (data) => {
      // Llamar a la función action para crear tipo de producto
      const response = await createTypeProduct(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    // Actualizar la caché de tipos de productos con el nuevo tipo de producto
    onSuccess: (res) => {
      // Actualizar la caché de tipos de productos
      queryClient.setQueryData<CreateTypeProductDto[]>(
        ["type-products"],
        (oldTypeProducts) => {
          if (!oldTypeProducts) return [res.data];
          return [...oldTypeProducts, res.data];
        }
      );

      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutación para actualizar tipo de producto
  const updateMutation = useMutation<
    BaseApiResponse<TypeProductResponse>,
    Error,
    UpdateTypeProductVariables
  >({
    mutationFn: async ({ id, data }) => {
      const response = await updateTypeProduct(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      // Actualizar la caché de usuarios
      queryClient.setQueryData<TypeProductResponse[]>(
        ["type-products"],
        (oldTypeProducts) => {
          if (!oldTypeProducts) return [res.data];

          const updatedTypeProducts = oldTypeProducts.map((typeProduct) =>
            typeProduct.id === res.data.id ? res.data : typeProduct
          );
          return updatedTypeProducts;
        }
      );

      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutación para eliminar tipo de producto
  const deleteMutation = useMutation<
    BaseApiResponse,
    Error,
    DeleteTypeProductDto
  >({
    mutationFn: async (DeleteTypeProductDto) => {
      const response = await deleteTypeProduct(DeleteTypeProductDto);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error: Error) => {
      if (
        error.message.includes("no autorizado") ||
        error.message.includes("sesión expirada")
      ) {
        toast.error("Sesión expirada. Por favor, inicie sesión nuevamente");
        return;
      }
      toast.error(error.message);
    },
  });

  // Mutación para reactivar tipo de producto
  const reactivateMutation = useMutation<
    BaseApiResponse,
    Error,
    ReactivateTypeProductDto
  >({
    mutationFn: async (ReactivateTypeProductDto) => {
      const response = await reactivateTypeProduct(ReactivateTypeProductDto);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error: Error) => {
      if (
        error.message.includes("no autorizado") ||
        error.message.includes("sesión expirada")
      ) {
        toast.error("Sesión expirada. Por favor, inicie sesión nuevamente");
        return;
      }

      toast.error(error.message);
    },
  });

  return {
    // Mutations
    createTypeProduct: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateTypeProduct: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteTypeProduct: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    reactivateTypeProduct: reactivateMutation.mutate,
    isReactivating: reactivateMutation.isPending,
    reactivateError: reactivateMutation.error,
  };
};
