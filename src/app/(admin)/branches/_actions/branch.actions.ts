"use server";

import { http } from "@/utils/serverFetch";
import { Branch, CreateBranchDto, UpdateBranchDto, DeleteBranchesDto } from "../_interfaces/branch.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createSafeAction } from '@/utils/createSafeAction';
import { z } from 'zod';

// type GetBranchesResponse = Branch[] | { error: string };
type CreateBranchResponse = BaseApiResponse | { error: string };
type UpdateBranchResponse = BaseApiResponse | { error: string };
type DeleteBranchResponse = BaseApiResponse | { error: string };

// type ApiResponse<T> = BaseApiResponse & {
//   data: T;
// };

// Schema para getBranches (aunque no tenga inputs, creamos uno vacío)
const GetBranchesSchema = z.object({});

const getBranchesHandler = async () => {
  console.log("🚀 Iniciando getBranchesHandler");
  try {
    console.log("📡 Haciendo petición HTTP a /branch");
    const [branches, error] = await http.get<Branch[]>("/branch");
    //console.log("📦 Respuesta:", { branches, error });

    if (error) {
      console.error("❌ Error detectado:", error);
      return { error: typeof error === 'object' && error !== null && 'message' in error 
        ? String(error.message) 
        : 'Error al obtener las sucursales' };
    }

    if (!Array.isArray(branches)) {
      console.error("❌ Branches no es un array:", branches);
      return { error: 'Respuesta inválida del servidor' };
    }

    //console.log("✅ Datos obtenidos correctamente:", branches);
    return { data: branches };
  } catch (error) {
    console.error("💥 Error en getBranchesHandler:", error);
    return { error: "Error al obtener las sucursales" };
  }
}

const getActiveBranchesHandler = async () => {
  try {
    const [branches, error] = await http.get<Branch[]>("/branch/active");

    if (error) {
      return { error: typeof error === 'object' && error !== null && 'message' in error 
        ? String(error.message) 
        : 'Error al obtener las sucursales' };
    }

    if (!Array.isArray(branches)) {
      return { error: 'Respuesta inválida del servidor' };
    }
    return { data: branches };
  } catch (error) {
    console.error("💥 Error en getBranchesHandler:", error);
    return { error: "Error al obtener las sucursales" };
  }
}

export const getBranches = await createSafeAction(GetBranchesSchema, getBranchesHandler);
export const getActiveBranches = await createSafeAction(GetBranchesSchema, getActiveBranchesHandler);

export async function createBranch(
  data: CreateBranchDto
): Promise<CreateBranchResponse> {
  try {
    const [branch, error] = await http.post<BaseApiResponse>("/branch", data);

    if (error) {
      // Solo manejamos el 401, pero podrían haber otros códigos importantes
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return branch;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al crear la sucursal" };
  }
}

export async function updateBranch(
  id: string,
  data: UpdateBranchDto
): Promise<UpdateBranchResponse> {
  try {
    const [branch, error] = await http.patch<BaseApiResponse>(`/branch/${id}`, data);

    if (error) {
      return { error: error.message };
    }

    return branch;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function deleteBranches(data: DeleteBranchesDto): Promise<DeleteBranchResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/branch/remove/all",data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar las sucursales" };
  }
}

export async function reactivateBranches(data: DeleteBranchesDto): Promise<DeleteBranchResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/branch/reactivate/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar las sucursales" };
  }
}
