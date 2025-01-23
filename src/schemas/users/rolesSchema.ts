import { z } from "zod";

export const createRolesSchema = z.object({
    name: z.string().min(1, "El nombre del rol es requerido"),
    description: z.string(),
    rolPermissions: z.array(z.string()),
});

export type CreateRolesSchema = z.infer<typeof createRolesSchema>;

export const updateRolesSchema = createRolesSchema.optional();

export type UpdateRolesSchema = z.infer<typeof updateRolesSchema>;
export type UpdateRoleSchema = UpdateRolesSchema & { id?: string };
