'use server';

import { z } from 'zod';
import { createSafeAction } from '@/utils/createSafeAction';
import { http } from '@/utils/serverFetch';
import { updateProfileSchema } from '../_interfaces/account.interface';

const PatchProfileSchema = z.object({
  userId: z.string().min(1, 'El ID del usuario es requerido'),
}).and(updateProfileSchema);

type PatchProfileInput = z.infer<typeof PatchProfileSchema>;

const handler = async (data: PatchProfileInput) => {
  const { userId, ...updateData } = data;
  
  try {
    const [response, error] = await http.patch(`/users/${userId}`, updateData);
    
    if (error) {
      return { error: error.message };
    }

    if (!response) {
      return { error: 'No se pudo actualizar el perfil' };
    }

    return { data: response };
  } catch (error) {
    return { error: 'Ocurrió un error al actualizar el perfil' };
  }
};

export const patchProfile = await createSafeAction(PatchProfileSchema, handler);
