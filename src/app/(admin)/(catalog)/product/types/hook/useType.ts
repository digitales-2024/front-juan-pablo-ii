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
    TypeProduct,
    UpdateTypeProductDto,

} from "../types";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateTypeProductVariables {
    data: UpdateTypeProductDto;
}
interface ResponseDataTypeProduct extends TypeProduct {
    isActive: boolean;
}

export const useTypeProducts = () => {
    const queryClient = useQueryClient();

    // Mutación para crear tipo de producto 
    //baseApiResponse lo que devuelve la api
    //Error lo que devuelve la api
    //CreateTypeProductDto lo que recibe la api
    const createMutation = useMutation<BaseApiResponse, Error, CreateTypeProductDto>({
        mutationFn: async (data) => {
            // Llamar a la función action para crear tipo de producto
            const response = await createTypeProduct(data);
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        // Actualizar la caché de tipos de productos con el nuevo tipo de producto
        onSuccess: (newTypeProduct) => {

            
            // Actualizar la caché de tipos de productos
            queryClient.setQueryData<ResponseDataTypeProduct>(
                ["type-products"],
                (oldTypeProducts) => {
                    if (!oldTypeProducts) return [newTypeProduct.data];
                    return [...oldTypeProducts, newTypeProduct.data];
                }
            );

            toast.success("Tipo de producto creado exitosamente");
        },
        onError: (error: Error) => {
            // Manejar diferentes tipos de errores
            if (
                error.message.includes("no autorizado") ||
                error.message.includes("sesión expirada")
            ) {
                toast.error(
                    "Sesión expirada. Por favor, inicie sesión nuevamente"
                );
                // TODO: Redirigir al login
                return;
            }

            toast.error(error.message);
        },
    });

    // Mutación para actualizar tipo de producto
    const updateMutation = useMutation<
        TypeProduct,
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
        onSuccess: (updatedTypeProduct) => {
            // Actualizar la caché de tipos de productos
            queryClient.setQueryData<TypeProduct[]>(
                ["type-products"],
                (oldTypeProducts) => {
                    if (!oldTypeProducts) return [updatedTypeProduct];
                    return oldTypeProducts.map((typeProduct) =>
                        typeProduct.id === updatedTypeProduct.id ? updatedTypeProduct : typeProduct
                    );
                }
            );

            toast.success("Tipo de producto actualizado exitosamente");
        },
        onError: (error: Error) => {
            // Manejar diferentes tipos de errores
            if (
                error.message.includes("no autorizado") ||
                error.message.includes("sesión expirada")
            ) {
                toast.error(
                    "Sesión expirada. Por favor, inicie sesión nuevamente"
                );
                // TODO: Redirigir al login
                return;
            }

            toast.error(error.message);
        },
    });

    // Mutación para eliminar tipo de producto
    const deleteMutation = useMutation<BaseApiResponse, Error, string>({
        mutationFn: async (id) => {
            const response = await deleteTypeProduct(id);
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
                toast.error(
                    "Sesión expirada. Por favor, inicie sesión nuevamente"
                );
                return;
            }
            toast.error(error.message);
        },
    });

    // Mutación para reactivar tipo de producto
    const reactivateMutation = useMutation<BaseApiResponse, Error, string>({
        mutationFn: async (id) => {
            const response = await reactivateTypeProduct(id);
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
                toast.error(
                    "Sesión expirada. Por favor, inicie sesión nuevamente"
                );
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