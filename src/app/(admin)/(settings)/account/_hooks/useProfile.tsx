import { useQuery } from '@tanstack/react-query';
import { getUser } from '../_actions/get-profile.action';
import { Profile } from '../_interfaces/account.interface';
import { useAuth } from '@/app/(auth)/sign-in/_hooks/useAuth';
import { getPermissions } from '../_actions/get-permissions.action';

export const useProfile = () => {
  const { user, isHydrated } = useAuth();

  const { data: profile } = useQuery<Profile, Error>({
    queryKey: ['profile'],
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

  const { data: permissions } = useQuery({
    queryKey: ['permissions', profile?.roles?.[0]?.id],
    queryFn: async () => {
      if (!profile?.roles?.[0]?.id) {
        throw new Error('No se encontró el rol del usuario');
      }

      const response = await getPermissions({ roleId: profile.roles[0].id });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
    enabled: Boolean(profile?.roles?.[0]?.id),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
  
  return {
    profile,
    permissions
  };
};