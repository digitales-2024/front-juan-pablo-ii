import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createIncoming,
  deleteIncoming,
  getDetailedIncomings,
  getIncomings,
  reactivateIncoming,
  updateIncoming,
  ListUpdatedDetailedIncomingResponse,
} from "../_actions/income.actions";
import { toast } from "sonner";
import {
  CreateIncomingDto,
  DeleteIncomingDto,
  UpdateIncomingDto,
  DetailedIncoming,
} from "../_interfaces/income.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateProductVariables {
  id: string;
  data: UpdateIncomingDto;
}

export const useIncoming = () => {
  const queryClient = useQueryClient();

  // Query para obtener los productos
  const detailedIncomingsQuery = useQuery({
    queryKey: ["detailed-incomings"],
    queryFn: async () => {
      const response = await getDetailedIncomings({});
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

  const incomingsQuery = useQuery({
    queryKey: ["incomings"],
    queryFn: async () => {
      const response = await getIncomings({});
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

  // const oneProductQuery = useQuery({
  //   queryKey: ["product", "some-product-id"], // replace "some-product-id" with the actual product id
  //   queryFn: async ({ queryKey }) => {
  //     const [, id] = queryKey;
  //     try {
  //       const response: ProductResponse = await getProductById(id);
  //       if (!response) {
  //         throw new Error("No se recibió respuesta del servidor");
  //       }
  //       if ("error" in response) {
  //         throw new Error(response.error);
  //       }
  //       if ("data" in response) {
  //         return response.data;
  //       }
  //     } catch (error) {
  //       if (error instanceof Error) return { error: error.message };
  //       return { error: "Error desconocido" };
  //     }
  //   },
  //   staleTime: 1000 * 60 * 5, // 5 minutos
  // });

  // Mutación para crear producto
  const createMutation = useMutation<
    {data: Omit<CreateIncomingDto, "movement" | "state">&{state:string}, message: string},
    Error,
    Omit<CreateIncomingDto, "movement" | "state">&{state:string}
  >({
    mutationFn: async (data) => {
      return new Promise<{ data: Omit<CreateIncomingDto, "movement" | "state">&{state:string}; message: string }>((resolve) => {
        setTimeout(() => {
          resolve({
            data,
            message: "Producto creado exitosamente",
          });
        }, 2000);
      });
    },
    onSuccess: (res) => {
      // queryClient.setQueryData<DetailedIncoming[] | undefined>(
      //   ["detailed-products"],
      //   (oldProducts) => {
      //     if (!oldProducts) return [res.data];
      //     return [...oldProducts, res.data];
      //   }
      // );
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutación para crear producto
  const originalCreateMutation = useMutation<
  BaseApiResponse<DetailedIncoming>,
  Error,
  CreateIncomingDto
>({
  mutationFn: async (data) => {
    const response = await createIncoming(data);
    if ("error" in response) {
      throw new Error(response.error);
    }
    // Retornamos directamente la respuesta ya que viene en el formato correcto
    return response;
  },
  onSuccess: (res) => {
    queryClient.setQueryData<DetailedIncoming[] | undefined>(
      ["detailed-products"],
      (oldProducts) => {
        if (!oldProducts) return [res.data];
        return [...oldProducts, res.data];
      }
    );
    toast.success(res.message);
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

  // Mutación para actualizar producto
  const updateMutation = useMutation<
    BaseApiResponse<DetailedIncoming>,
    Error,
    UpdateProductVariables
  >({
    mutationFn: async ({ id, data }) => {
      const response = await updateIncoming(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<DetailedIncoming[] | undefined>(
        ["detailed-products"],
        (oldProducts) => {
          if (!oldProducts) return undefined;
          return oldProducts.map((product) =>
            product.id === res.data.id ? { ...product, ...res.data } : product
          );
        }
      );
      toast.success("Producto actualizado exitosamente");
    },
    onError: (error) => {
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el producto");
      }
    },
  });

  // Mutación para eliminar productos
  const deleteMutation = useMutation<
    ListUpdatedDetailedIncomingResponse,
    Error,
    DeleteIncomingDto
  >({
    mutationFn: async (data) => {
      const response = await deleteIncoming(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedIncoming[]>(
        ["detailed-products"],
        (oldProducts) => {
          console.log("🔄 Cache actual:", oldProducts);
          if (!oldProducts) {
            console.log("⚠️ No hay productos en caché");
            return [];
          }
          const updatedProducts = oldProducts.map((product) => {
            if (variables.ids.includes(product.id)) {
              return { ...product, isActive: false };
            }
            return product;
          });
          console.log("📦 Nueva caché:", updatedProducts);
          return updatedProducts;
        }
      );

      toast.success(
        variables.ids.length === 1
          ? "Producto desactivado exitosamente"
          : "Productos desactivados exitosamente"
      );
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el/los producto(s)");
      }
    },
  });

  // Mutación para reactivar productos
  const reactivateMutation = useMutation<
    ListUpdatedDetailedIncomingResponse,
    Error,
    DeleteIncomingDto
  >({
    mutationFn: async (data) => {
      const response = await reactivateIncoming(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedIncoming[]>(
        ["detailed-products"],
        (oldProducts) => {
          if (!oldProducts) {
            return [];
          }
          const updatedProducts = oldProducts.map((product) => {
            if (variables.ids.includes(product.id)) {
              return { ...product, isActive: true };
            }
            return product;
          });
          return updatedProducts;
        }
      );

      toast.success(
        variables.ids.length === 1
          ? "Producto reactivado exitosamente"
          : "Productos reactivados exitosamente"
      );
    },
    onError: (error) => {
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el/los producto(s)");
      }
    },
  });

  return {
    detailedIncomingsQuery,
    incomingsQuery,
    originalCreateMutation,
    // products: productsQuery.data,
    // oneProductQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
