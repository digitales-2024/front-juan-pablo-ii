"use server";

import { http } from "@/utils/serverFetch";
import {
  Service,
  CreateServiceDto,
  UpdateServiceDto,
  DeleteServicesDto
} from "../_interfaces/service.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createSafeAction } from '@/utils/createSafeAction';
import { z } from 'zod';

type CreateServiceResponse = BaseApiResponse | { error: string };
type UpdateServiceResponse = BaseApiResponse | { error: string };
type DeleteServiceResponse = BaseApiResponse | { error: string };
type OneServiceResponse = Service | { error: string };

// Schema para getServices
const GetServicesSchema = z.object({});

const getServicesHandler = async () => {
  console.log("🚀 Iniciando getServicesHandler");
  try {
    console.log("📡 Haciendo petición HTTP a /service");
    const [services, error] = await http.get<Service[]>("/services");
    //console.log("📦 Respuesta:", { services, error });

    if (error) {
      console.error("❌ Error detectado:", error);
      return {
        error: typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Error al obtener los servicios'
      };
    }

    if (!Array.isArray(services)) {
      //console.error("❌ Services no es un array:", services);
      return { error: 'Respuesta inválida del servidor' };
    }

    //console.log("✅ Datos obtenidos correctamente:", services);
    return { data: services };
  } catch (error) {
    console.error("💥 Error en getServicesHandler:", error);
    return { error: "Error al obtener los servicios" };
  }
}

export const getServices = await createSafeAction(GetServicesSchema, getServicesHandler);

export async function getServiceById(id: string): Promise<OneServiceResponse> {
  try {
    const [service, error] = await http.get<OneServiceResponse>(`/services/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el almacén",
      };
    }
    return service;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export async function createService(
  data: CreateServiceDto
): Promise<CreateServiceResponse> {
  try {
    const [service, error] = await http.post<BaseApiResponse>("/services", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return service;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al crear el servicio" };
  }
}

export async function updateService(
  id: string,
  data: UpdateServiceDto
): Promise<UpdateServiceResponse> {
  try {
    const [service, error] = await http.patch<BaseApiResponse>(`/services/${id}`, data);

    if (error) {
      return { error: error.message };
    }

    return service;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function deleteServices(data: DeleteServicesDto): Promise<DeleteServiceResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/services/remove/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar los servicios" };
  }
}

export async function reactivateServices(data: DeleteServicesDto): Promise<DeleteServiceResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/services/reactivate/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar los servicios" };
  }
} 2