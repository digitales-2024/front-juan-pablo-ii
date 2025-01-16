'use server';

import { z } from 'zod';
import { createSafeAction } from '@/utils/createSafeAction';
import { serverFetch } from '@/utils/serverFetch';
import { ExtendedUser, UserResponse } from '../_interfaces/account.interface';
import { sleep } from '@/utils/sleep';
import type { User } from '@/app/(auth)/types';

const GetUserSchema = z.object({
  userId: z.string().min(1, 'El ID de usuario es requerido'),
});

type GetUserInput = z.infer<typeof GetUserSchema>;

const handler = async (data: GetUserInput) => {
  try {
    const [account, error] = await serverFetch<ExtendedUser>(`/users/${data.userId}`);
    
    if (error) {
      return { error: error.message };
    }

    const mappedAccount: UserResponse = {
      name: account.name ?? '',
      email: account.email ?? '',
      phone: account.phone ?? '',
      roles: account.roles?.map(role => ({ name: role.name })),
      lastLogin: account.lastLogin ? new Date(account.lastLogin) : undefined
    };

    return { data: mappedAccount };
  } catch (error) {
    return { error: 'Error al obtener la cuenta del usuario' };
  }
};

export const getUser = await createSafeAction(GetUserSchema, handler);