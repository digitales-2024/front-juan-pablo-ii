'use server';

import { z } from 'zod';

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
    // Validamos los datos de entrada usando el schema de Zod
    const validationResult = schema.safeParse(data);

    // Si la validación falla, devolvemos los errores de validación
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return {
        validationErrors: Object.fromEntries(
          Object.entries(fieldErrors).map(([key, value]) => [key, value ?? []])
        ) as Record<string, string[]>,
      };
    }

    try {
      // Si la validación es exitosa, ejecutamos el handler con los datos validados
      return await handler(validationResult.data);
    } catch (error) {
      // Capturamos cualquier error no manejado y devolvemos un mensaje genérico
      return {
        error: 'Ha ocurrido un error interno',
      };
    }
  };
}
