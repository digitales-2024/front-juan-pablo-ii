'use server';

import { z } from 'zod';
import { createSafeAction } from '@/utils/createSafeAction';
import { serverFetch } from '@/utils/serverFetch';
import { Account } from '../_interfaces/account.interface';
import { sleep } from '@/utils/sleep';

const GetAccountSchema = z.object({
  userId: z.string().min(1, 'El ID de usuario es requerido'),
});

type GetAccountInput = z.infer<typeof GetAccountSchema>;

const handler = async (data: GetAccountInput) => {
  try {
    const [account, error] = await serverFetch<Account>(`/users/${data.userId}`);
    
    if (error) {
      return { error: error.message };
    }

    return { data: account };
  } catch (error) {
    return { error: 'Error al obtener la cuenta del usuario' };
  }
};

export const getAccount = await createSafeAction(GetAccountSchema, handler);