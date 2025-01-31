import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createTypeProduct,
  deleteTypeProduct,
  reactivateTypeProduct,
  updateTypeProduct,
  getTypeProducts,
  getActiveTypeProducts,
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

  // Query para obtener los tipos de productos
  const typeProductsQuery = useQuery<TypeProductResponse[], Error>({
    queryKey: ["type-products"],
    queryFn: async () => {
      const response = await getTypeProducts();
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
  });
  const activeTypeProductsQuery = useQuery<TypeProductResponse[], Error>({
    queryKey: ["activeTypeProducts"],
    queryFn: async () => {
      const response = await getActiveTypeProducts();
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
  });

  // Mutación para crear tipo de producto
  const createMutation = useMutation<
    BaseApiResponse<TypeProductResponse>,
    Error,
    CreateTypeProductDto
  >({
    mutationFn: async (data) => {
      const response = await createTypeProduct(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<TypeProductResponse[]>(
        ["type-products"],
        (oldTypeProducts) => {
          if (!oldTypeProducts) return [res.data];
          return [...oldTypeProducts, res.data];
        }
      );
      toast.success("Tipo de producto creado exitosamente");
    },
    onError: (error) => {
     
      toast.error(error.message || "Error al crear el tipo de producto");
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
    mutationFn: async (data) => {
      const response = await deleteTypeProduct(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<TypeProductResponse[]>(
        ["type-products"],
        (oldTypeProducts) => {
          if (!oldTypeProducts) return [];
          
          const updatedTypeProducts = oldTypeProducts.map((typeProduct) => {
            if (variables.ids.includes(typeProduct.id)) {
              return { ...typeProduct, isActive: false };
            }
            return typeProduct;
          });
          return updatedTypeProducts;
        }
      );

      toast.success(
        variables.ids.length === 1
          ? "Tipo de producto desactivado exitosamente"
          : "Tipos de producto desactivados exitosamente"
      );
    },
    onError: (error: Error) => {
      
      if (error.message.includes("no autorizado") || error.message.includes("sesión expirada")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el/los tipo(s) de producto");
      }
    },
  });

  // Mutación para reactivar tipo de producto
  const reactivateMutation = useMutation<
    BaseApiResponse<TypeProductResponse>,
    Error,
    ReactivateTypeProductDto
  >({
    mutationFn: async (data) => {
      const response = await reactivateTypeProduct(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      // Actualizar la caché de tipos de productos
      queryClient.setQueryData<TypeProductResponse[]>(
        ["type-products"],
        (oldTypeProducts) => {
          if (!oldTypeProducts) return [];
          
          const updatedTypeProducts = oldTypeProducts.map((typeProduct) => {
            if (variables.ids.includes(typeProduct.id)) {
              return { ...typeProduct, isActive: true };
            }
            return typeProduct;
          });
          return updatedTypeProducts;
        }
      );
      
      toast.success(res.message);
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

    data: typeProductsQuery.data,
    isLoading: typeProductsQuery.isLoading,
    isError: typeProductsQuery.isError,
    error: typeProductsQuery.error,
    refetch: typeProductsQuery.refetch,
    activeData: activeTypeProductsQuery.data,
    activeIsLoading: activeTypeProductsQuery.isLoading,
    activeIsError: activeTypeProductsQuery.isError,
    activeError: activeTypeProductsQuery.error,
    activeRefetch: activeTypeProductsQuery.refetch,
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
