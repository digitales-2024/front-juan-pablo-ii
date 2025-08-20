# 🏥 Módulo de Citas Médicas (Appointment Medical) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Citas Médicas** es un sistema de gestión de citas médicas activas que permite a médicos, personal administrativo y super administradores visualizar, gestionar y actualizar el estado de las citas confirmadas. El módulo implementa un sistema de roles que determina qué citas puede ver cada usuario y qué acciones puede realizar.

## 📁 Estructura del Módulo

```
apoointment-medical/
├── _actions/
│   └── appoointmentMedical.actions.ts     # Server Actions para citas médicas
├── _components/
│   ├── ApoointmentTable.tsx               # Tabla principal de citas
│   ├── ApoointmentTableColumns.tsx        # Columnas dinámicas según rol
│   ├── LoadingDialogForm.tsx              # Componente de carga
│   └── errorComponents/
│       ├── DataDependencyErrorMessage.tsx # Error de dependencias
│       └── GeneralErrorMessage.tsx        # Error general
├── _hooks/
│   └── useApointmentMedical.ts            # Hook principal del módulo
├── _interfaces/
│   └── apoointments-medical.inteface.ts   # Tipos y schemas
├── _statics/
│   ├── errors.ts                          # Mensajes de error
│   └── metadata.ts                        # Metadatos de la página
├── error.tsx                              # UI de error
├── loading.tsx                            # UI de carga
├── page.tsx                               # Página principal
└── README.md                              # Esta documentación
```

## 🔧 Interfaces y Tipos

```typescript
// src/app/(admin)/(apointment-medical)/apoointment-medical/_interfaces/apoointments-medical.inteface.ts
import { components } from "@/types/api";
import { z } from "zod";
import { BriefcaseMedical, HeartPulseIcon, LucideIcon, ScanHeartIcon } from "lucide-react";

// Tipos base de la API
export type UpdateAppointmentUserDto = components["schemas"]["UpdateAppointmentUserDto"];

// Interfaz de respuesta de cita
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

// Schema de validación para actualizar cita
export const UpdateAppointmentUserDto = z.object({
  status: z.enum(["COMPLETED", "NO_SHOW"]),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(["COMPLETED", "NO_SHOW"]),
}) satisfies z.ZodType<UpdateAppointmentUserDto>;

// Estados de cita
export type AppointmentStatus = "COMPLETED" | "NO_SHOW" | "CONFIRMED";

// Configuración de estilos por estado
export type EnumConfig = {
  name: string;
  backgroundColor: string;
  textColor: string;
  hoverBgColor: string;
  hoverTextColor?: string;
  importantBgColor?: string;
  importantHoverBgColor?: string;
  importantTextColor?: string;
  importantHoverTextColor?: string;
  icon: LucideIcon;
};

// Configuración visual por estado
export const orderTypeConfig: Record<AppointmentStatus, EnumConfig> = {
  CONFIRMED: {
    name: "Receta médica",
    backgroundColor: "bg-[#E0F7FA]",
    hoverBgColor: "hover:bg-[#B2EBF2]",
    textColor: "text-[#00796B]",
    icon: HeartPulseIcon,
  },
  COMPLETED: {
    name: "Receta médica",
    backgroundColor: "bg-[#E0F7FA]",
    hoverBgColor: "hover:bg-[#B2EBF2]",
    textColor: "text-[#00796B]",
    icon: ScanHeartIcon,
  },
  NO_SHOW: {
    name: "Receta médica",
    backgroundColor: "bg-[#E0F7FA]",
    hoverBgColor: "hover:bg-[#B2EBF2]",
    textColor: "text-[#00796B]",
    icon: BriefcaseMedical,
  },
};
```

## 🎣 Hooks del Módulo

```typescript
// src/app/(admin)/(apointment-medical)/apoointment-medical/_hooks/useApointmentMedical.ts
export const useAppointmentConfirmed = () => {
  /**
   * Hook principal que determina automáticamente qué consulta realizar según el rol del usuario
   */
  const useRoleBasedConfirmedAppointments = () => {
    const { user } = useAuth();

    // Determinar el rol del usuario
    const isSuperAdmin = user?.isSuperAdmin === true;
    const isSuperAdminRole = user?.roles?.some((role) => role.name === "SUPER_ADMIN") ?? false;
    const isDoctor = user?.roles?.some((role) => role.name === "MEDICO") ?? false;
    const isReceptionist = user?.roles?.some((role) => role.name === "ADMINISTRATIVO") ?? false;
    const isAdmin = isSuperAdmin || isSuperAdminRole;

    // Determinar la función y key de query según el rol
    let queryFn;
    let queryKey;
    let enabled = true;

    if (isDoctor && user?.id) {
      queryFn = async () => {
        const response = await getDoctorConfirmedAppointments(user.id);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas confirmadas");
        }
        return response;
      };
      queryKey = ["doctor-confirmed-appointments", user.id];
    } else if (isReceptionist && user?.id) {
      queryFn = async () => {
        const response = await getBranchConfirmedAppointments(user.id);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas confirmadas de la sucursal");
        }
        return response;
      };
      queryKey = ["branch-confirmed-appointments", user.id];
    } else if (isAdmin) {
      queryFn = async () => {
        const response = await getAllConfirmedAppointments();
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas confirmadas");
        }
        return response;
      };
      queryKey = ["all-confirmed-appointments"];
    } else {
      // Usuario sin rol definido
      queryFn = () => [];
      queryKey = ["no-appointments"];
      enabled = false;
    }

    return {
      ...useQuery<AppointmentResponse[], Error>({
        queryKey,
        queryFn,
        enabled,
      }),
      userRole: { isAdmin, isDoctor, isReceptionist },
      userId: user?.id,
    };
  };

  /**
   * Hook para citas de un médico específico
   */
  const useDoctorConfirmedAppointments = (doctorId: string) =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["doctor-confirmed-appointments", doctorId],
      queryFn: async () => {
        const response = await getDoctorConfirmedAppointments(doctorId);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas confirmadas");
        }
        return response;
      },
      enabled: !!doctorId,
    });

  /**
   * Hook para todas las citas (acceso administrativo)
   */
  const useAllConfirmedAppointments = () =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["all-confirmed-appointments"],
      queryFn: async () => {
        const response = await getAllConfirmedAppointments();
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas confirmadas");
        }
        return response;
      },
    });

  /**
   * Hook para citas de una sucursal específica
   */
  const useBranchConfirmedAppointments = (userId: string) =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["branch-confirmed-appointments", userId],
      queryFn: async () => {
        const response = await getBranchConfirmedAppointments(userId);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas confirmadas de la sucursal");
        }
        return response;
      },
      enabled: !!userId,
    });

  /**
   * Mutación para actualizar el estado de una cita
   */
  const updateStatusMutation = useMutation<
    BaseApiResponse<AppointmentResponse>,
    Error,
    { id: string; data: UpdateAppointmentUserDto }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await updateAppointmentStatus(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message || "Estado de cita actualizado con éxito");
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar el estado de la cita");
    },
  });

  return {
    useDoctorConfirmedAppointments,
    useAllConfirmedAppointments,
    useBranchConfirmedAppointments,
    useRoleBasedConfirmedAppointments,
    updateStatusMutation,
  };
};
```

## 🚀 Server Actions

```typescript
// src/app/(admin)/(apointment-medical)/apoointment-medical/_actions/appoointmentMedical.actions.ts

/**
 * Obtiene las citas confirmadas para un médico específico
 */
export async function getDoctorConfirmedAppointments(
  doctorId: string
): Promise<AppointmentsResponseBase> {
  try {
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/doctor/${doctorId}/confirmed`
    );

    if (error) {
      return {
        error: typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Error al obtener citas confirmadas del médico",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Obtiene todas las citas confirmadas (acceso administrativo)
 */
export async function getAllConfirmedAppointments(): Promise<AppointmentsResponseBase> {
  try {
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/admin/confirmed`
    );

    if (error) {
      return {
        error: typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Error al obtener todas las citas confirmadas",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Obtiene citas confirmadas para la sucursal asociada a un usuario
 */
export async function getBranchConfirmedAppointments(
  userId: string
): Promise<AppointmentsResponseBase> {
  try {
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/branch/${userId}/confirmed`
    );

    if (error) {
      return {
        error: typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Error al obtener citas confirmadas de la sucursal",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Actualiza el estado de una cita médica
 */
export async function updateAppointmentStatus(
  id: string,
  data: UpdateAppointmentUserDto
): Promise<UpdateAppointmentResponseBase> {
  try {
    const [response, error] = await http.patch<
      BaseApiResponse<AppointmentResponse>
    >(`/appointments-user/${id}/status`, data);

    if (error) {
      return {
        error: typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Error al actualizar el estado de la cita",
      };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}
```

## 🎨 Componentes Principales

### AppointmentTable (Tabla Principal)

```typescript
// ApoointmentTable.tsx
export function AppointmentTable({
  data,
  userRole,
  userId,
  onRefresh,
}: AppointmentTableProps) {
  // Generar columnas basadas en el rol del usuario
  const columns = getAppointmentColumns(userRole, userId, onRefresh);

  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por paciente..."
      columnVisibilityConfig={{
        id: true,
        staff: true,
        service: true,
        branch: true,
        patient: true,
        start: true,
        end: true,
        status: true,
        medicalHistoryId: false, // Oculto pero usado para navegación
      }}
    />
  );
}
```

### ApoointmentTableColumns (Columnas Dinámicas)

```typescript
// ApoointmentTableColumns.tsx
export const getAppointmentColumns = (
  userRole: UserRole,
  userId?: string,
  onRefresh?: () => void
): ColumnDef<AppointmentResponse>[] => {
  const { updateStatusMutation } = useAppointmentConfirmed();

  // Estilos comunes para celdas con fondo de color
  const cellBgStyles = {
    patient: "bg-emerald-50 text-emerald-800 rounded-md px-2 py-1",
    service: "bg-purple-50 text-purple-800 rounded-md px-2 py-1",
    start: "bg-blue-50 text-blue-800 rounded-md px-2 py-1",
    end: "bg-cyan-50 text-cyan-800 rounded-md px-2 py-1",
    staff: "bg-amber-50 text-amber-800 rounded-md px-2 py-1",
    branch: "bg-orange-50 text-orange-800 rounded-md px-2 py-1",
  };

  // Columnas base (para todos los roles)
  const baseColumns: ColumnDef<AppointmentResponse>[] = [
    {
      accessorKey: "patient",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Paciente">
          <div className="flex items-center justify-center w-full">
            <UserRound className="h-4 w-4 mr-1 text-emerald-600" />
            <span>Paciente</span>
          </div>
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center w-full items-center">
          <div className={cellBgStyles.patient}>
            <div className="flex items-center">
              <UserRound className="h-4 w-4 mr-2 text-emerald-600" />
              <span>{row.original.patient}</span>
            </div>
          </div>
        </div>
      ),
    },
    // ... otras columnas base
  ];

  // Columnas adicionales para administrativos y super admin
  const additionalColumns: ColumnDef<AppointmentResponse>[] = [
    {
      accessorKey: "staff",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Médico">
          <div className="flex items-center justify-center w-full">
            <UserRound className="h-4 w-4 mr-1 text-amber-600" />
            <span>Médico</span>
          </div>
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center w-full items-center">
          <div className={cellBgStyles.staff}>
            <div className="flex items-center">
              <UserRound className="h-4 w-4 mr-2 text-amber-600" />
              <span>{row.original.staff}</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Columna de historia médica (para todos los roles)
  const viewHistoryColumn: ColumnDef<AppointmentResponse> = {
    id: "viewHistory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Historia">
        <div className="flex items-center justify-center w-full">
          <FileText className="h-4 w-4 mr-1 text-sky-600" />
          <span>Historia</span>
        </div>
      </DataTableColumnHeader>
    ),
    cell: ({ row }) => {
      const router = useRouter();
      const medicalHistoryId = row.original.medicalHistoryId;

      return (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              router.push(`/update-history/${medicalHistoryId}`);
            }}
            className="flex items-center gap-2 shadow-md bg-sky-500 text-white hover:bg-sky-600 border-0 py-2 px-3 transition-all relative"
            disabled={!medicalHistoryId}
            size="default"
          >
            <ClipboardPlus className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Historia</span>
            <span className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
              </svg>
            </span>
          </Button>
        </div>
      );
    },
  };

  // Columna de acciones para cambiar estado (solo para médicos y administrativos)
  const actionColumn: ColumnDef<AppointmentResponse> = {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones">
        <div className="flex items-center justify-center w-full">
          <Check className="h-4 w-4 mr-1" />
          <span>Acciones</span>
        </div>
      </DataTableColumnHeader>
    ),
    cell: ({ row }) => {
      const [showStatusButtons, setShowStatusButtons] = useState(false);
      const [isUpdating, setIsUpdating] = useState(false);
      const appointmentId = row.original.id;
      const isConfirmed = row.original.status === "CONFIRMED";

      const handleStatusChange = async (status: "COMPLETED" | "NO_SHOW") => {
        if (isUpdating) return;

        setIsUpdating(true);
        try {
          await updateStatusMutation.mutateAsync(
            {
              id: appointmentId,
              data: { status },
            },
            {
              onSuccess: () => {
                toast.success(
                  `Cita marcada como ${
                    status === "COMPLETED" ? "completada" : "no asistida"
                  }`
                );
                if (onRefresh) onRefresh();
              },
            }
          );
        } catch (error) {
          toast.error("Error al actualizar el estado de la cita");
          console.error(error);
        } finally {
          setIsUpdating(false);
        }
      };

      // No mostrar acciones si la cita ya no está confirmada
      if (!isConfirmed) {
        return (
          <div className="text-center text-sm text-muted-foreground flex items-center justify-center">
            <Badge variant="outline">Finalizada</Badge>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              id={`show-buttons-${appointmentId}`}
              checked={showStatusButtons}
              onCheckedChange={setShowStatusButtons}
            />
            <Label htmlFor={`show-buttons-${appointmentId}`} className="text-xs">
              {showStatusButtons ? "Ocultar" : "Actualizar"}
            </Label>
          </div>

          {showStatusButtons && (
            <div className="flex gap-2 mt-1">
              <Button
                onClick={() => handleStatusChange("COMPLETED")}
                disabled={isUpdating}
                className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 hover:text-white"
                size="sm"
                variant="outline"
              >
                <ClipboardCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Atendido</span>
              </Button>
              <Button
                onClick={() => handleStatusChange("NO_SHOW")}
                disabled={isUpdating}
                className="h-8 px-2 bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1 hover:text-white"
                size="sm"
                variant="outline"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">No asistió</span>
              </Button>
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  };

  // Construir las columnas según el rol
  let columns = [...baseColumns];

  // Agregar columnas adicionales para administrativos y super admin
  if (userRole.isSuperAdmin || userRole.isReceptionist) {
    columns = [...columns, ...additionalColumns];
  }

  // Agregar columna de historia médica para todos
  columns.push(viewHistoryColumn);

  // Agregar columna de acciones solo si es médico o personal de mesón
  if (userRole.isDoctor || userRole.isReceptionist || userRole.isSuperAdmin) {
    columns.push(actionColumn);
  }

  return columns;
};
```

## 📄 Página Principal

```typescript
// page.tsx
export default function PageAppointmentsComplete() {
  const { useRoleBasedConfirmedAppointments } = useAppointmentConfirmed();
  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
    refetch,
    userRole,
    userId
  } = useRoleBasedConfirmedAppointments();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const initialLoadDone = useRef(false);
  const [isDataReady, setIsDataReady] = useState(false);

  // Combinar estados de carga para mejor UX
  const isShowLoading = isLoading || isRefreshing || !isDataReady;

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return; // Evitar solicitudes múltiples
    setIsRefreshing(true);
    setIsDataReady(false);
    
    try {
      void refetch().then((result) => {
        const successMessage = userRole.isDoctor 
          ? "Citas médicas actualizadas" 
          : userRole.isReceptionist 
            ? "Citas médicas actualizadas" 
            : "Citas médicas actualizadas";
        
        // Pequeño retraso para asegurar que la UI esté lista antes de mostrar los datos
        setTimeout(() => {
          setIsDataReady(true);
          setIsRefreshing(false);
          
          // Solo mostramos el mensaje de éxito si hay datos o si es la carga inicial
          if (result.data && result.data.length > 0 || !initialLoadDone.current) {
            toast.success(successMessage);
          }
        }, 300);
      });
    } catch (err) {
      console.error("Error al refrescar datos:", err);
      toast.error("Error al actualizar los datos");
      setIsRefreshing(false);
      setIsDataReady(true);
    }
  }, [refetch, userRole, isRefreshing]);

  // Efecto para la carga inicial ÚNICA
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      handleRefresh();
    }
  }, [handleRefresh]);

  // Efecto separado SOLO para visibilityChange
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Página visible, actualizando datos...');
        handleRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleRefresh]);

  // Cuando los datos iniciales están disponibles pero aún no marcados como listos
  useEffect(() => {
    if (!isLoading && !isRefreshing && !isDataReady && appointments) {
      setIsDataReady(true);
    }
  }, [isLoading, isRefreshing, appointments, isDataReady]);

  if (isShowLoading) {
    return <LoadingCategories />;
  }

  if (isError) {
    console.error("Error:", error);
    notFound();
  }

  if (!appointments.length) {
    return (
      <>
        <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
          <PageHeader
            title={METADATA.title}
            description={METADATA.description}
          />
        </div>
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-100 mt-4">
          <div className="p-6 bg-sky-50 rounded-full mb-6">
            <CalendarClock className="h-12 w-12 text-sky-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No hay citas programadas
          </h2>
          <p className="text-gray-500 text-center max-w-md mb-6">
            {userRole.isDoctor
              ? "Actualmente no tienes citas médicas programadas para atender."
              : "No se encontraron citas programadas en el sistema."}
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-2">
            <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
              <Stethoscope className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="text-emerald-700">Consulta médica</span>
            </div>
            <div className="flex items-center p-3 bg-amber-50 rounded-lg">
              <Users className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-amber-700">Atención a pacientes</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader title={METADATA.title} description={METADATA.description} />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <AppointmentTable
          data={appointments}
          userRole={{
            isSuperAdmin: userRole.isAdmin,
            isDoctor: userRole.isDoctor,
            isReceptionist: userRole.isReceptionist,
          }}
          userId={userId}
          onRefresh={handleRefresh}
        />
      </div>
    </>
  );
}
```

## 🔄 Sistema de Roles

### Roles y Permisos

```typescript
interface UserRole {
  isSuperAdmin: boolean;    // Super administrador
  isDoctor: boolean;        // Médico
  isReceptionist: boolean;  // Personal administrativo/mesón
}

// Comportamiento por rol:
// - MÉDICO: Ve solo sus citas confirmadas, puede actualizar estado
// - ADMINISTRATIVO: Ve citas de su sucursal, puede actualizar estado
// - SUPER_ADMIN: Ve todas las citas, puede actualizar estado
```

### Endpoints por Rol

```typescript
// Médico
GET /appointments-user/doctor/{doctorId}/confirmed
GET /appointments-user/doctor/{doctorId}/completed

// Personal administrativo
GET /appointments-user/branch/{userId}/confirmed
GET /appointments-user/branch/{userId}/completed

// Super administrador
GET /appointments-user/admin/confirmed
GET /appointments-user/admin/completed

// Actualización de estado (todos los roles autorizados)
PATCH /appointments-user/{id}/status
```

## 🔄 Guías de Implementación

### Agregar un Nuevo Estado de Cita

1) Actualizar tipos:
```typescript
// apoointments-medical.inteface.ts
export type AppointmentStatus = "COMPLETED" | "NO_SHOW" | "CONFIRMED" | "NUEVO_ESTADO";

export const updateAppointmentSchema = z.object({
  status: z.enum(["COMPLETED", "NO_SHOW", "NUEVO_ESTADO"]),
}) satisfies z.ZodType<UpdateAppointmentUserDto>;
```

2) Agregar configuración visual:
```typescript
export const orderTypeConfig: Record<AppointmentStatus, EnumConfig> = {
  // ... estados existentes
  NUEVO_ESTADO: {
    name: "Nuevo Estado",
    backgroundColor: "bg-[#FFF3E0]",
    hoverBgColor: "hover:bg-[#FFE0B2]",
    textColor: "text-[#E65100]",
    icon: NuevoIcono,
  },
};
```

3) Actualizar Server Actions:
```typescript
// appoointmentMedical.actions.ts
export async function getNuevoEstadoAppointments(doctorId: string) {
  const [appointments, error] = await http.get<AppointmentResponse[]>(
    `/appointments-user/doctor/${doctorId}/nuevo-estado`
  );
  // ... manejo de errores
}
```

### Agregar Nuevas Columnas

1) Definir en `getAppointmentColumns`:
```typescript
const nuevaColumna: ColumnDef<AppointmentResponse> = {
  accessorKey: "nuevoCampo",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Nuevo Campo">
      <div className="flex items-center justify-center w-full">
        <NuevoIcono className="h-4 w-4 mr-1 text-nuevo-color" />
        <span>Nuevo Campo</span>
      </div>
    </DataTableColumnHeader>
  ),
  cell: ({ row }) => (
    <div className="flex justify-center w-full items-center">
      <div className="bg-nuevo-bg text-nuevo-text rounded-md px-2 py-1">
        <div className="flex items-center">
          <NuevoIcono className="h-4 w-4 mr-2 text-nuevo-color" />
          <span>{row.original.nuevoCampo}</span>
        </div>
      </div>
    </div>
  ),
};
```

2) Agregar a la configuración de visibilidad:
```typescript
columnVisibilityConfig={{
  // ... columnas existentes
  nuevoCampo: true,
}}
```

### Personalizar Estilos de Celdas

```typescript
// Estilos personalizados para nuevas columnas
const cellBgStyles = {
  // ... estilos existentes
  nuevoCampo: "bg-indigo-50 text-indigo-800 rounded-md px-2 py-1",
  otroCampo: "bg-pink-50 text-pink-800 rounded-md px-2 py-1",
};
```

## 🧪 Testing del Módulo

### Casos de Prueba Recomendados

- **Roles**: Verificar que cada rol ve las citas correctas y tiene los permisos adecuados.
- **Estados**: Cambio de estado de citas (COMPLETED, NO_SHOW) y verificación de UI.
- **Navegación**: Acceso a historias médicas desde la tabla.
- **Filtros**: Búsqueda por paciente y verificación de resultados.
- **Responsive**: Comportamiento en diferentes tamaños de pantalla.
- **Performance**: Carga con muchas citas y actualización de estado.

### Logs de Debug

```typescript
console.log("🚀 ~ useRoleBasedConfirmedAppointments ~ user:", user);
console.log('Página visible, actualizando datos...');
console.error("Error al refrescar datos:", err);
console.error("Error:", error);
```

## 📈 Métricas y Monitoreo

### KPIs Recomendados

- **Citas por médico**: Distribución de carga de trabajo.
- **Tasa de asistencia**: COMPLETED vs NO_SHOW.
- **Tiempo de atención**: Promedio de duración de citas.
- **Uso por rol**: Actividad de médicos vs administrativos.

### Métricas de Uso

```typescript
// Tracking de actualización de estado
const trackStatusUpdate = (appointmentId: string, newStatus: string, userRole: string) => {
  analytics.track('appointment_status_updated', {
    appointment_id: appointmentId,
    new_status: newStatus,
    user_role: userRole,
    timestamp: new Date().toISOString()
  });
};

// Tracking de acceso a historias médicas
const trackHistoryAccess = (medicalHistoryId: string, userRole: string) => {
  analytics.track('medical_history_accessed', {
    history_id: medicalHistoryId,
    user_role: userRole,
    timestamp: new Date().toISOString()
  });
};
```

## 🔒 Seguridad y Permisos

- **Autorización**: Verificar permisos para ver/actualizar citas según rol.
- **Validación**: Sanitización de IDs y estados de cita.
- **Auditoría**: Logging de cambios de estado y acceso a historias.

Permisos sugeridos:
- `appointments:read`, `appointments:update_status`
- `medical_history:read`, `medical_history:update`
- `branch:read` (para personal administrativo)

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
