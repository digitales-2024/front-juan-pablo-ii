import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  reactivateProduct,
  getProducts,
  getDetailedProducts,
  getProductById,
  ProductResponse
} from "../_actions/products.actions";
import { toast } from "sonner";
import {
  Product, CreateProductDto, DeleteProductDto, UpdateProductDto,
  DetailedProduct,
} from "../_interfaces/outgoing.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateProductVariables {
  id: string;
  data: UpdateProductDto;
}

export const useProducts = () => {
  const queryClient = useQueryClient();

  // Query para obtener los productos
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getProducts({});
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

  const detailedProductsQuery = useQuery({
    queryKey: ["detailed-products"],
    queryFn: async () => {
      const response = await getDetailedProducts({});
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

  const oneProductQuery = useQuery({
    queryKey: ["product", "some-product-id"], // replace "some-product-id" with the actual product id
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      try{
        const response: ProductResponse = await getProductById(id);
        if (!response) {
          throw new Error("No se recibió respuesta del servidor");
        }
        if ('error' in response) {
          throw new Error(response.error);
        }
        if ('data' in response) {
          return response.data;
        }
      } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear producto
  const createMutation = useMutation<BaseApiResponse<Product>, Error, CreateProductDto>({
    mutationFn: async (data) => {
      const response = await createProduct(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      // Retornamos directamente la respuesta ya que viene en el formato correcto
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<DetailedProduct[] | undefined>(
        ["detailed-products"], (oldProducts) => {
          if (!oldProducts) return [res.data as DetailedProduct];
          return [...oldProducts, res.data as DetailedProduct];
      });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Mutación para actualizar producto
  const updateMutation = useMutation<BaseApiResponse<Product>, Error, UpdateProductVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateProduct(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<DetailedProduct[] | undefined>(["detailed-products"], (oldProducts) => {
        if (!oldProducts) return undefined;
        return oldProducts.map((product) =>
          product.id === res.data.id ? {...product, ...res.data} : product
        );
      });
      toast.success("Producto actualizado exitosamente");
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el producto");
      }
    },
  });

  // Mutación para eliminar productos
  const deleteMutation = useMutation<BaseApiResponse<Product>, Error, DeleteProductDto>({
    mutationFn: async (data) => {
      const response = await deleteProduct(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedProduct[]>(["detailed-products"], (oldProducts) => {
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
      });

      toast.success(
        variables.ids.length === 1
          ? "Producto desactivado exitosamente"
          : "Productos desactivados exitosamente"
      );
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el/los producto(s)");
      }
    },
  });

  // Mutación para reactivar productos
  const reactivateMutation = useMutation<BaseApiResponse<Product>, Error, DeleteProductDto>({
    mutationFn: async (data) => {
      const response = await reactivateProduct(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedProduct[]>(["detailed-products"], (oldProducts) => {
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
      });

      toast.success(
        variables.ids.length === 1
          ? "Producto reactivado exitosamente"
          : "Productos reactivados exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el/los producto(s)");
      }
    },
  });

  return {
    productsQuery,
    detailedProductsQuery,
    products: productsQuery.data,
    oneProductQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
