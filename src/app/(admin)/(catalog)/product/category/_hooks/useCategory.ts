import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  reactivateCategory,
  getCategories,
  getActiveCategories
} from "../_actions/category.actions";
import { toast } from "sonner";
import {
  Category, CreateCategoryDto, DeleteCategoriesDto, UpdateCategoryDto,
} from "../_interfaces/category.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateBranchVariables {
  id: string;
  data: UpdateCategoryDto;
}

export const useCategories = () => {
  const queryClient = useQueryClient();

  // Query para obtener las categorías
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories({});
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

  const activeCategoriesQuery = useQuery({
    queryKey: ["activeCategories"],
    queryFn: async () => {
      const response = await getActiveCategories({});
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

  // Mutación para crear categoría
  const createMutation = useMutation<BaseApiResponse<Category>, Error, CreateCategoryDto>({
    mutationFn: async (data) => {
      const response = await createCategory(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      // Retornamos directamente la respuesta ya que viene en el formato correcto
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Category[]>(["categories"], (oldCategories) => {
        if (!oldCategories) return [res.data];
        return [...oldCategories, res.data];
      });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Mutación para actualizar categoría
  const updateMutation = useMutation<BaseApiResponse<Category>, Error, UpdateBranchVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateCategory(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Category[]>(["categories"], (oldCategories) => {
        if (!oldCategories) {
          return [res.data];
        }
        const updatedCategories = oldCategories.map((category) =>
          category.id === res.data.id ? res.data : category
        );
        return updatedCategories;
      });
      toast.success("Categoría actualizada exitosamente");
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar la categoría");
      }
    },
  });

  // Mutación para eliminar categorías
  const deleteMutation = useMutation<BaseApiResponse<Category>, Error, DeleteCategoriesDto>({
    mutationFn: async (data) => {
      const response = await deleteCategory(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Category[]>(["categories"], (oldCategories) => {
        console.log("🔄 Cache actual:", oldCategories);
        if (!oldCategories) {
          return [];
        }
        const updatedCategories = oldCategories.map((category) => {
          if (variables.ids.includes(category.id)) {
            return { ...category, isActive: false };
          }
          return category;
        });
        return updatedCategories;
      });

      toast.success(
        variables.ids.length === 1
          ? "Categoría desactivada exitosamente"
          : "Categorías desactivadas exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar la(s) categoría(s)");
      }
    },
  });

  // Mutación para reactivar categorías
  const reactivateMutation = useMutation<BaseApiResponse<Category>, Error, DeleteCategoriesDto>({
    mutationFn: async (data) => {
      const response = await reactivateCategory(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Category[]>(["categories"], (oldCategories) => {
        if (!oldCategories) {
          return [];
        }
        const updatedCategories = oldCategories.map((category) => {
          if (variables.ids.includes(category.id)) {
            return { ...category, isActive: true };
          }
          return category;
        });
        return updatedCategories;
      });

      toast.success(
        variables.ids.length === 1
          ? "Categoría reactivada exitosamente"
          : "Categorías reactivadas exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar la(s) categoría(s)");
      }
    },
  });

  return {
    categoriesQuery,
    categories: categoriesQuery.data,
    activeCategoriesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
