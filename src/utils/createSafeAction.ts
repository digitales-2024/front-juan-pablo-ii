"use server";

import { z } from "zod";

/**
 * Tipo que define la estructura de respuesta estándar para todas las acciones del servidor
 * @template T - Tipo de datos que se devolverá en caso de éxito
 */
export type ActionResponse<T> = {
  /** Datos devueltos en caso de éxito */
  data?: T;
  /** Mensaje de error general */
  error?: string;
  /** Errores de validación por campo */
  validationErrors?: Record<string, string[]>;
};

/**
 * Wrapper para crear acciones del servidor seguras con validación y manejo de errores estandarizado
 * @template TInput - Tipo de datos de entrada que se validará
 * @template TOutput - Tipo de datos que devolverá la acción en caso de éxito
 * @param schema - Schema de Zod para validar los datos de entrada
 * @param handler - Función que maneja la lógica principal de la acción
 * @returns Función asíncrona que ejecuta la acción con validación y manejo de errores
 */
export async function createSafeAction<TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionResponse<TOutput>>
) {
  return async (data: TInput): Promise<ActionResponse<TOutput>> => {
    console.log("🔒 Validando datos con Zod:", data);
    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      console.error("❌ Validación fallida:", validationResult.error.flatten());
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return {
        validationErrors: Object.fromEntries(
          Object.entries(fieldErrors).map(([key, value]) => [key, value ?? []])
        ) as Record<string, string[]>,
      };
    }

    try {
      console.log("🚀 Ejecutando handler con datos validados");
      return await handler(validationResult.data);
    } catch (error) {
      console.error("💥 Error no manejado en createSafeAction:", error);
      console.log(error);

      // Capturamos cualquier error no manejado y devolvemos un mensaje genérico
      return {
        error: "Ha ocurrido un error interno",
      };
    }
  };
}
