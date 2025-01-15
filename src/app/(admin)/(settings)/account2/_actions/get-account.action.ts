'use server';

import { z } from 'zod';
import { createSafeAction } from '@/utils/createSafeAction';
import { serverApi } from '@/api/server.api';
import { Account } from '../_interfaces/account.interface';
import { sleep } from '@/utils/sleep';

const GetAccountSchema = z.object({
  userId: z.string().min(1, 'El ID de usuario es requerido'),
});

type GetAccountInput = z.infer<typeof GetAccountSchema>;

const handler = async (data: GetAccountInput) => {
  try {
    await sleep(500);
    const { data: account } = await serverApi.get<Account>(`/users/${data.userId}`);
    return { data: account };
  } catch (error) {
    return { error: 'Error al obtener la cuenta del usuario' };
  }
};

export const getAccount = await createSafeAction(GetAccountSchema, handler);