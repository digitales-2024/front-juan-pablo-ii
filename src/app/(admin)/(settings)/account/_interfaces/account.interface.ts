import { components } from "@/types/api";
import { z } from "zod";

export type ResponseProfile = components["schemas"]["UserProfileResponseDto"];
export type Profile = Omit<ResponseProfile, 'id'>
export type UpdateUserDto = components["schemas"]["UpdateUserDto"];

export const updateProfileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  phone: z.string().min(1, "El teléfono es requerido").optional(),
}) satisfies z.ZodType<UpdateUserDto>;

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;