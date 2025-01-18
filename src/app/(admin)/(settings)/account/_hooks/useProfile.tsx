import { useQuery } from '@tanstack/react-query';
import { getUser } from '../_actions/get-profile.action';
import { Profile } from '../_interfaces/account.interface';
import { useAuth } from '@/app/(auth)/sign-in/_hooks/useAuth';

export const useProfile = () => {
  const { user, isHydrated } = useAuth();

  return useQuery<Profile, Error>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      const response = await getUser({ userId: user.id });
      
      if (response.validationErrors) {
        const firstError = Object.values(response.validationErrors).flat()[0];
        throw new Error(firstError);
      }

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No se encontraron datos del perfil');
      }

      return response.data;
    },
    enabled: Boolean(user?.id) && isHydrated,
    staleTime: 1000 * 60 * 60, // 1 hora
    retry: 1,
  });
};
