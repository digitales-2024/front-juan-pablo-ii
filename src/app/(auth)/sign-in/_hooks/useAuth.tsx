"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn } from "../_actions/sign-in.action";
import { useRouter } from "next/navigation";
import { Profile } from "../_interfaces/auth.interface";
import { LoginAuthDto } from "../_interfaces/auth.interface";
import { toast } from "sonner";

interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  isHydrated: boolean;
  setUser: (user: Profile) => void;
  logout: () => void;
}

/**
 * Hook personalizado para manejar el estado de autenticación
 * Utiliza Zustand para la gestión del estado y persist para mantener los datos en localStorage
 */
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isHydrated: false,

      /**
       * Establece los datos del usuario en el estado
       * @param user - Objeto con los datos del perfil del usuario
       */
      setUser: (user: Profile) =>
        set({
          user: {
            ...user,
            roles: user.roles || [],
            lastLogin: user.lastLogin ?? undefined,
          },
        }),

      /**
       * Cierra la sesión del usuario actual
       * Realiza una petición al endpoint de logout y limpia el estado
       */
      logout: () => {
        set({ isLoading: true });
        try {
          set({ user: null });
        } catch (error) {
          console.error("Error durante el logout:", error);
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage", // Nombre del almacenamiento en localStorage
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            state.isHydrated = true;
          }
          return state;
        };
      },
    }
  )
);

/**
 * Hook personalizado para manejar el proceso de inicio de sesión
 * @returns {Object} Objeto de mutación con funciones y estado para el proceso de login
 */
export function useSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginAuthDto) => {
      const result = await signIn(credentials);

      if (result.validationErrors) {
        throw new Error(
          Object.values(result.validationErrors).flat().join(", ")
        );
      }

      if (result.error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new Error(result.error);
      }

      if (!result.data) {
        throw new Error("No se recibieron datos del servidor");
      }

      return result.data;
    },
    /**
     * Callback ejecutado cuando el inicio de sesión es exitoso
     * Transforma y almacena los datos del usuario en el estado
     * @param response - Respuesta del servidor con los datos del usuario
     */
    onSuccess: async (response) => {
      const profileData: Profile = {
        id: response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        roles: response.roles || [],
        isSuperAdmin: response.isSuperAdmin,
        isActive: true,
        mustChangePassword: false,
        lastLogin: new Date().toISOString(),
        branchId: response.branchId, // Añadir esta línea
      };

      // Console log para ver los datos del usuario en el navegador
      console.log("🔐 Usuario autenticado en el cliente:", {
        profileData,
   
      });

      setUser(profileData);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Inicio de sesión exitoso");
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(`Error en inicio de sesión: ${error.message}`);
    },
  });
}
