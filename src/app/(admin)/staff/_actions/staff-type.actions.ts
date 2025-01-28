"use server";

import { http } from "@/utils/serverFetch";
import { 
  StaffType, 
  CreateStaffTypeDto, 
  UpdateStaffTypeDto, 
  DeleteStaffTypeDto 
} from "../_interfaces/staff-type.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createSafeAction } from '@/utils/createSafeAction';
import { z } from 'zod';

type CreateStaffTypeResponse = BaseApiResponse | { error: string };
type UpdateStaffTypeResponse = BaseApiResponse | { error: string };
type DeleteStaffTypeResponse = BaseApiResponse | { error: string };

// Schema para getStaffTypes
const GetStaffTypesSchema = z.object({});

const getStaffTypesHandler = async () => {
  console.log("🚀 Iniciando getStaffTypesHandler");
  try {
    const [staffTypes, error] = await http.get<StaffType[]>("/staff-type");

    if (error) {
      return { error: typeof error === 'object' && error !== null && 'message' in error 
        ? String(error.message) 
        : 'Error al obtener los tipos de personal' };
    }

    if (!Array.isArray(staffTypes)) {
      return { error: 'Respuesta inválida del servidor' };
    }

    return { data: staffTypes };
  } catch (error) {
    return { error: "Error al obtener los tipos de personal" };
  }
}

export const getStaffTypes = await createSafeAction(GetStaffTypesSchema, getStaffTypesHandler);

export async function createStaffType(
  data: CreateStaffTypeDto
): Promise<CreateStaffTypeResponse> {
  try {
    const [staffType, error] = await http.post<BaseApiResponse>("/staff-type", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return staffType;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al crear el tipo de personal" };
  }
}

export async function updateStaffType(
  id: string,
  data: UpdateStaffTypeDto
): Promise<UpdateStaffTypeResponse> {
  try {
    const [staffType, error] = await http.patch<BaseApiResponse>(`/staff-type/${id}`, data);

    if (error) {
      return { error: error.message };
    }

    return staffType;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function deleteStaffTypes(data: DeleteStaffTypeDto): Promise<DeleteStaffTypeResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/staff-type/remove/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar los tipos de personal" };
  }
}

export async function reactivateStaffTypes(data: DeleteStaffTypeDto): Promise<DeleteStaffTypeResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/staff-type/reactivate/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar los tipos de personal" };
  }
} 