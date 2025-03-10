import { components } from "@/types/api";
import { z } from "zod";

export type UpdateAppointmentUserDto =
  components["schemas"]["UpdateAppointmentUserDto"];

export type AppointmentStatus = "COMPLETED" | "NO_SHOW";

export type AppointmentResponse = {
  id: string;
  staff: string;
  service: string;
  branch: string;
  patient: string;
  start: string;
  end: string;
  status: string;
  medicalHistoryId: string;
};

export const UpdateAppointmentUserDto = z.object({
  status: z.enum(["COMPLETED", "NO_SHOW"]),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(["COMPLETED", "NO_SHOW"]),
}) satisfies z.ZodType<UpdateAppointmentUserDto>;

/* exelente buen analisis bien pues vamos a implementar este hook de useAuth para poder identificar que usuario esta logeado si para poder usar una funcion especifica en este caso solo vamos  a usar las funciones de para confirmado si bien esto iniciara desde mi page en el page tenemos que verificar el tipo de usuario logeado solo hay 3 el primero es " SUPER_ADMIN,ADMINISTRATIVO,MEDICO" como lo aviamos configurado el super admin es el admistrativo y el admistrativo es el del meson y el medico es el medico bien ayudame con esto si promero vamos a validar al usuario despues vamos a decidir que funcion usar si para poder enviar losd atos y agregarlos correctamente amis columnas para mostrar estos  */