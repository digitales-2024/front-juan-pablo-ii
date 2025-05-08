'use server';

import { z } from 'zod';
import { createSafeAction } from '@/utils/createSafeAction';
// import { sleep } from '@/utils/sleep';
import { http } from '@/utils/serverFetch';
import { Profile } from '../_interfaces/account.interface';

const GetUserSchema = z.object({
  userId: z.string().min(1, 'El ID de usuario es requerido'),
});

type GetUserInput = z.infer<typeof GetUserSchema>;

const handler = async (data: GetUserInput) => {
  try {
    const [account, error] = await http.get<Profile>(`/users/${data.userId}`);

    if (error) {
      return { error: error.message };
    }

    const mappedAccount: Profile = {
      name: account.name ?? '',
      email: account.email ?? '',
      phone: account.phone ?? '',
      isSuperAdmin: account.isSuperAdmin ?? false,
      roles:
        account.roles?.map((role) => ({ id: role.id, name: role.name })) || [],
    };

    return { data: mappedAccount };
  } catch (error) {
    console.log(error);
    return { error: 'Error al obtener la cuenta del usuario' };
  }
};

export const getUser = await createSafeAction(GetUserSchema, handler);
