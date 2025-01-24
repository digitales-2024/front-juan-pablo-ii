'use server';

import { z } from 'zod';
import { createSafeAction } from '@/utils/createSafeAction';
import { http } from '@/utils/serverFetch';

// Definir la interfaz para los permisos
export interface Permission {
  id: string;
  name: string;
  description?: string;
  rolPermission?: string[];
}

const GetPermissionsSchema = z.object({
  roleId: z.string().min(1, 'El ID del rol es requerido'),
});

type GetPermissionsInput = z.infer<typeof GetPermissionsSchema>;

const handler = async (data: GetPermissionsInput) => {
  try {
    const [permissions, error] = await http.get<Permission>(
      `/rol/${data.roleId}`
    );

    if (error) {
      return { error: error.message };
    }

    if (!permissions) {
      return { error: 'No se encontraron permisos' };
    }

    return { data: permissions };
  } catch (error) {
    console.log(error);
    return { error: 'Error al obtener los permisos' };
  }
};

export const getPermissions = await createSafeAction(
  GetPermissionsSchema,
  handler
);
