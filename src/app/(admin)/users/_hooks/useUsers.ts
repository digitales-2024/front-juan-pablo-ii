import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../actions";
import { toast } from "sonner";
import { UserCreateDto, UserResponseDto } from "../types";

export const useUsers = () => {
  const queryClient = useQueryClient(); 

  // Mutación para crear usuario
  const createMutation = useMutation<
    UserResponseDto,
    Error,
    UserCreateDto
  >({
    mutationFn: async (data) => {
      const response = await createUser(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (newUser) => {
      // Actualizar la caché de usuarios
      queryClient.setQueryData<UserResponseDto[]>(
        ["users"],
        (oldUsers) => {
          if (!oldUsers) return [newUser];
          return [...oldUsers, newUser];
        }
      );
      
      toast.success("Usuario creado exitosamente");
    },
    onError: (error: Error) => {
      // Manejar diferentes tipos de errores
      if (error.message.includes("no autorizado") || error.message.includes("sesión expirada")) {
        toast.error("Sesión expirada. Por favor, inicie sesión nuevamente");
        // TODO: Redirigir al login
        return;
      }
      
      toast.error(error.message);
    },
  });

  return {

    // Mutations
    createUser: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // TODO: Agregar mutaciones para editar y eliminar usuarios
    // updateUser: updateMutation.mutate,
    // isUpdating: updateMutation.isPending,
    // updateError: updateMutation.error,
    // deleteUser: deleteMutation.mutate,
    // isDeleting: deleteMutation.isPending,
    // deleteError: deleteMutation.error,
  };
};
