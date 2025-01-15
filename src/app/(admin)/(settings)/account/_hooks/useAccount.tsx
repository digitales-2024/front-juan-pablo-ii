import { useQuery } from '@tanstack/react-query';
import { getAccount } from '../_actions/get-account.action';
import { Account } from '../_interfaces/account.interface';

export const useAccount = (userId: string) => {
  return useQuery<Account, Error>({
    queryKey: ['account', userId],
    queryFn: async () => {
      const response = await getAccount({ userId });
      
      if (response.validationErrors) {
        throw new Error(Object.values(response.validationErrors).flat()[0]);
      }

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data!;
    },
    staleTime: 1000 * 60,
  });
};
