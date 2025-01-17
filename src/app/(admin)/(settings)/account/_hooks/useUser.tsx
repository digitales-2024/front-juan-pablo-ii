import { useQuery } from '@tanstack/react-query';
import { getUser } from '../_actions/get-user.action';
import { UserResponse } from '@/app/(auth)/sign-in/_interfaces/auth.interface';

export const useUser = (userId: string) => {
  return useQuery<UserResponse, Error>({
    queryKey: ['account', userId],
    queryFn: async () => {
      const response = await getUser({ userId });
      
      if (response.validationErrors) {
        throw new Error(Object.values(response.validationErrors).flat()[0]);
      }

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data!;
    },
    staleTime: 1000 * 60 * 60,
  });
};
