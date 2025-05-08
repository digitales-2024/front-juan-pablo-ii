"use server";

import { http } from "@/utils/serverFetch";
import {
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  DeleteStaffDto
} from "../_interfaces/staff.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createSafeAction } from '@/utils/createSafeAction';
import { z } from 'zod';

type CreateStaffResponse = BaseApiResponse | { error: string };
type UpdateStaffResponse = BaseApiResponse | { error: string };
type DeleteStaffResponse = BaseApiResponse | { error: string };
type GetOneStaffResponse = Staff | { error: string };

// Schema para getStaff
const GetStaffSchema = z.object({});

const getStaffHandler = async () => {
  try {
    const [staff, error] = await http.get<Staff[]>("/staff");

    if (error) {
      return {
        error: typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Error al obtener el personal'
      };
    }

    if (!Array.isArray(staff)) {
      return { error: 'Respuesta inválida del servidor' };
    }

    return { data: staff };
  } catch (error) {
    console.error("💥 Error en getStaffHandler:", error);
    return { error: "Error al obtener el personal" };
  }
}

const getActiveStaffHandler = async () => {
  try {
    const [staff, error] = await http.get<Staff[]>("/staff/active");

    if (error) {
      return {
        error: typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Error al obtener el personal'
      };
    }

    if (!Array.isArray(staff)) {
      return { error: 'Respuesta inválida del servidor' };
    }

    return { data: staff };
  } catch (error) {
    console.error("💥 Error en getStaffHandler:", error);
    return { error: "Error al obtener el personal" };
  }
}

export const getStaffById = async (id: string) => {
  try {
    const [staff, error] = await http.get<GetOneStaffResponse>(`/staff/${id}`);

    if (error) {
      return {
        error: typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Error al obtener el personal'
      };
    }

    return staff;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error al obtener el personal" };
  }
}

export const getStaff = await createSafeAction(GetStaffSchema, getStaffHandler);
export const getACtiveStaff = await createSafeAction(GetStaffSchema, getActiveStaffHandler);

export async function createStaff(
  data: CreateStaffDto
): Promise<CreateStaffResponse> {
  try {
    console.log(data);
    const [staff, error] = await http.post<BaseApiResponse>("/staff", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }
    console.log(staff);


    return staff;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al crear el personal" };
  }
}

export async function updateStaff(
  id: string,
  data: UpdateStaffDto
): Promise<UpdateStaffResponse> {
  try {
    // Asegurarse de que los campos vacíos se envíen como cadenas vacías
    const cleanData = { ...data };

    // Asegurarse de que userId, cmp y branchId se envíen como cadenas vacías si no tienen valor
    if (cleanData.userId === undefined) {
      cleanData.userId = "";
    }

    if (cleanData.cmp === undefined) {
      cleanData.cmp = "";
    }

    if (cleanData.branchId === undefined) {
      cleanData.branchId = "";
    }

    // Log para depuración
    console.log("Datos enviados al backend:", cleanData);

    const [staff, error] = await http.patch<BaseApiResponse>(`/staff/${id}`, cleanData);

    if (error) {
      return { error: error.message };
    }

    return staff;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function deleteStaff(data: DeleteStaffDto): Promise<DeleteStaffResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/staff/remove/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar el personal" };
  }
}

export async function reactivateStaff(data: DeleteStaffDto): Promise<DeleteStaffResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/staff/reactivate/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar el personal" };
  }
}
