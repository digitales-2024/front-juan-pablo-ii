# ✅ Módulo de Citas Médicas Completadas (Appointment Medical Complete) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Citas Médicas Completadas** es un sistema de gestión y visualización de citas médicas que han sido finalizadas (COMPLETED o NO_SHOW). Este módulo complementa al módulo de citas activas, permitiendo a médicos, personal administrativo y super administradores revisar el historial de citas atendidas y generar reportes de actividad médica.

## 📁 Estructura del Módulo

```
apoointment-medical-complete/
├── _actions/
│   └── appoointmentMedical.actions.ts     # Server Actions para citas completadas
├── _components/
│   ├── ApoointmentTable.tsx               # Tabla principal de citas completadas
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
// src/app/(admin)/(apointment-medical)/apoointment-medical-complete/_interfaces/apoointments-medical.inteface.ts
import { components } from "@/types/api";
import { z } from "zod";
import { BriefcaseMedical, HeartPulseIcon, LucideIcon, ScanHeartIcon } from "lucide-react";

// Tipos base de la API
export type UpdateAppointmentUserDto = components["schemas"]["UpdateAppointmentUserDto"];

// Interfaz de respuesta de cita completada
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

// Estados de cita (solo los finalizados)
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
// src/app/(admin)/(apointment-medical)/apoointment-medical-complete/_hooks/useApointmentMedical.ts
export const useAppointmentComplete = () => {
  /**
   * Hook principal que determina automáticamente qué consulta realizar según el rol del usuario
   * Específicamente para citas COMPLETADAS (COMPLETED y NO_SHOW)
   */
  const useRoleBasedCompletedAppointments = () => {
    const { user } = useAuth();
    
    // Determinar el rol del usuario
    const isSuperAdmin = user?.isSuperAdmin === true;
    const isSuperAdminRole = user?.roles?.some(role => role.name === "SUPER_ADMIN") ?? false;
    const isDoctor = user?.roles?.some(role => role.name === "MEDICO") ?? false;
    const isReceptionist = user?.roles?.some(role => role.name === "ADMINISTRATIVO") ?? false;
    const isAdmin = isSuperAdmin || isSuperAdminRole;
    
    // Determinar la función y key de query según el rol
    let queryFn;
    let queryKey;
    let enabled = true;
    
    if (isDoctor && user?.id) {
      queryFn = async () => {
        const response = await getDoctorCompletedAppointments(user.id);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas completadas");
        }
        return response;
      };
      queryKey = ["doctor-completed-appointments", user.id];
    } else if (isReceptionist && user?.id) {
      queryFn = async () => {
        const response = await getBranchCompletedAppointments(user.id);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas completadas de la sucursal");
        }
        return response;
      };
      queryKey = ["branch-completed-appointments", user.id];
    } else if (isAdmin) {
      queryFn = async () => {
        const response = await getAllCompletedAppointments();
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas completadas");
        }
        return response;
      };
      queryKey = ["all-completed-appointments"];
    } else {
      // Usuario sin rol definido
      queryFn = () => Promise.resolve([]);
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
      userId: user?.id
    };
  };

  /**
   * Hook para citas completadas de un médico específico
   */
  const useDoctorCompletedAppointments = (doctorId: string) =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["doctor-completed-appointments", doctorId],
      queryFn: async () => {
        const response = await getDoctorCompletedAppointments(doctorId);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas completadas");
        }
        return response;
      },
      enabled: !!doctorId,
    });

  /**
   * Hook para todas las citas completadas (acceso administrativo)
   */
  const useAllCompletedAppointments = () =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["all-completed-appointments"],
      queryFn: async () => {
        const response = await getAllCompletedAppointments();
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas completadas");
        }
        return response;
      },
    });

  /**
   * Hook para citas completadas de una sucursal específica
   */
  const useBranchCompletedAppointments = (userId: string) =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["branch-completed-appointments", userId],
      queryFn: async () => {
        const response = await getBranchCompletedAppointments(userId);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas completadas de la sucursal");
        }
        return response;
      },
      enabled: !!userId,
    });

  /**
   * Mutación para actualizar el estado de una cita (aunque en este módulo es principalmente para consulta)
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
    useDoctorCompletedAppointments,
    useAllCompletedAppointments,
    useBranchCompletedAppointments,
    useRoleBasedCompletedAppointments,
    updateStatusMutation,
  };
};
```

## 🚀 Server Actions

```typescript
// src/app/(admin)/(apointment-medical)/apoointment-medical-complete/_actions/appoointmentMedical.actions.ts

/**
 * Obtiene las citas completadas para un médico específico
 */
export async function getDoctorCompletedAppointments(
  doctorId: string
): Promise<AppointmentsResponseBase> {
  console.log("🚀 ~ getDoctorCompletedAppointments:", doctorId)
  try {
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/doctor/${doctorId}/completed`
    );

    if (error) {
      return {
        error: typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Error al obtener citas completadas del médico",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Obtiene todas las citas completadas (acceso administrativo)
 */
export async function getAllCompletedAppointments(): Promise<AppointmentsResponseBase> {
  try {
    console.log("🚀 ~ getAllCompletedAppointments")
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/admin/completed`
    );

    if (error) {
      return {
        error: typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Error al obtener todas las citas completadas",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Obtiene citas completadas para la sucursal asociada a un usuario
 */
export async function getBranchCompletedAppointments(
  userId: string
): Promise<AppointmentsResponseBase> {
  console.log("🚀 ~ getBranchCompletedAppointments:", userId)
  try {
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/branch/${userId}/completed`
    );

    if (error) {
      return {
        error: typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Error al obtener citas completadas de la sucursal",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Actualiza el estado de una cita médica (principalmente para casos especiales)
 */
export async function updateAppointmentStatus(
  id: string,
  data: UpdateAppointmentUserDto
): Promise<UpdateAppointmentResponseBase> {
  console.log("🚀 ~ data:", data)
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
  const { updateStatusMutation } = useAppointmentComplete();

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
    // ... otras columnas base similares al módulo de citas activas
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

  // Columna de acciones (limitada para citas completadas)
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

      // Para citas completadas, mostrar estado final
      if (!isConfirmed) {
        return (
          <div className="text-center text-sm text-muted-foreground flex items-center justify-center">
            <Badge variant="outline">Finalizada</Badge>
          </div>
        );
      }

      // Solo mostrar acciones si la cita aún está confirmada (caso especial)
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
  const { useRoleBasedCompletedAppointments } = useAppointmentComplete();
  const {
    data: appointments = [],
    isLoading: isQueryLoading,
    isError,
    error,
    refetch,
    userRole,
    userId
  } = useRoleBasedCompletedAppointments();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const initialLoadDone = useRef(false);
  const [isDataReady, setIsDataReady] = useState(false);

  // Combinar estados de carga para mejor UX
  const isLoading = isQueryLoading || isRefreshing || !isDataReady;

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return; // Evitar solicitudes múltiples
    setIsRefreshing(true);
    setIsDataReady(false);
    
    try {
      void refetch().then((result) => {
        const successMessage = userRole.isDoctor 
          ? "Citas médicas completadas actualizadas" 
          : userRole.isReceptionist 
            ? "Citas médicas completadas actualizadas" 
            : "Citas médicas completadas actualizadas";
        
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
    if (!isQueryLoading && !isRefreshing && !isDataReady && appointments) {
      setIsDataReady(true);
    }
  }, [isQueryLoading, isRefreshing, appointments, isDataReady]);

  if (isLoading) {
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
            No hay citas completadas
          </h2>
          <p className="text-gray-500 text-center max-w-md mb-6">
            {userRole.isDoctor
              ? "Actualmente no tienes citas médicas completadas registradas."
              : "No se encontraron citas completadas en el sistema."}
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-2">
            <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
              <Stethoscope className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="text-emerald-700">Historial médico</span>
            </div>
            <div className="flex items-center p-3 bg-amber-50 rounded-lg">
              <Users className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-amber-700">Reportes de actividad</span>
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

## 🔄 Diferencias con el Módulo de Citas Activas

### Comparación de Funcionalidades

| Característica | Citas Activas | Citas Completadas |
|----------------|---------------|-------------------|
| **Estado de citas** | CONFIRMED | COMPLETED, NO_SHOW |
| **Propósito** | Gestión diaria | Historial y reportes |
| **Acciones disponibles** | Cambiar estado | Principalmente consulta |
| **Actualización automática** | Alta frecuencia | Moderada |
| **Filtros** | Por estado activo | Por estado finalizado |
| **Navegación** | A historias médicas | A historias médicas |

### Endpoints Específicos

```typescript
// Endpoints para citas completadas
GET /appointments-user/doctor/{doctorId}/completed
GET /appointments-user/branch/{userId}/completed  
GET /appointments-user/admin/completed

// vs Endpoints para citas activas
GET /appointments-user/doctor/{doctorId}/confirmed
GET /appointments-user/branch/{userId}/confirmed
GET /appointments-user/admin/confirmed
```

## 🔄 Guías de Implementación

### Agregar Nuevos Estados de Cita Completada

1) Actualizar tipos:
```typescript
// apoointments-medical.inteface.ts
export type AppointmentStatus = "COMPLETED" | "NO_SHOW" | "CONFIRMED" | "CANCELLED" | "RESCHEDULED";

export const updateAppointmentSchema = z.object({
  status: z.enum(["COMPLETED", "NO_SHOW", "CANCELLED", "RESCHEDULED"]),
}) satisfies z.ZodType<UpdateAppointmentUserDto>;
```

2) Agregar configuración visual:
```typescript
export const orderTypeConfig: Record<AppointmentStatus, EnumConfig> = {
  // ... estados existentes
  CANCELLED: {
    name: "Cancelada",
    backgroundColor: "bg-[#FFEBEE]",
    hoverBgColor: "hover:bg-[#FFCDD2]",
    textColor: "text-[#C62828]",
    icon: XCircle,
  },
  RESCHEDULED: {
    name: "Reprogramada",
    backgroundColor: "bg-[#FFF3E0]",
    hoverBgColor: "hover:bg-[#FFE0B2]",
    textColor: "text-[#E65100]",
    icon: Calendar,
  },
};
```

3) Actualizar Server Actions:
```typescript
// appoointmentMedical.actions.ts
export async function getCancelledAppointments(doctorId: string) {
  const [appointments, error] = await http.get<AppointmentResponse[]>(
    `/appointments-user/doctor/${doctorId}/cancelled`
  );
  // ... manejo de errores
}
```

### Agregar Filtros por Fecha

```typescript
// En el hook useRoleBasedCompletedAppointments
const useRoleBasedCompletedAppointments = (dateRange?: { start: Date; end: Date }) => {
  // ... lógica existente
  
  // Agregar parámetros de fecha a las queries
  if (isDoctor && user?.id) {
    queryFn = async () => {
      const params = dateRange ? {
        startDate: format(dateRange.start, 'yyyy-MM-dd'),
        endDate: format(dateRange.end, 'yyyy-MM-dd')
      } : {};
      
      const response = await getDoctorCompletedAppointments(user.id, params);
      // ... resto de la lógica
    };
  }
};
```

### Agregar Exportación de Datos

```typescript
// Nuevo componente para exportar
const ExportButton = ({ appointments }: { appointments: AppointmentResponse[] }) => {
  const handleExport = () => {
    const csvContent = appointments.map(app => 
      `${app.patient},${app.service},${app.start},${app.end},${app.status}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citas-completadas-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Exportar CSV
    </Button>
  );
};
```

## 🧪 Testing del Módulo

### Casos de Prueba Recomendados

- **Roles**: Verificar que cada rol ve las citas completadas correctas.
- **Estados**: Verificación de citas COMPLETED y NO_SHOW.
- **Navegación**: Acceso a historias médicas desde citas completadas.
- **Filtros**: Búsqueda por paciente en historial.
- **Performance**: Carga con muchas citas completadas.
- **Exportación**: Generación de reportes (si se implementa).

### Logs de Debug

```typescript
console.log("🚀 ~ getDoctorCompletedAppointments:", doctorId);
console.log("🚀 ~ getAllCompletedAppointments");
console.log("🚀 ~ getBranchCompletedAppointments:", userId);
console.log("🚀 ~ data:", data);
console.log('Página visible, actualizando datos...');
console.error("Error al refrescar datos:", err);
```

## 📈 Métricas y Monitoreo

### KPIs Recomendados

- **Tasa de finalización**: COMPLETED vs NO_SHOW.
- **Tiempo promedio de atención**: Duración de citas completadas.
- **Productividad por médico**: Citas completadas por período.
- **Tendencias temporales**: Patrones de finalización por mes/semana.

### Métricas de Uso

```typescript
// Tracking de consulta de historial
const trackHistoryAccess = (medicalHistoryId: string, userRole: string, appointmentStatus: string) => {
  analytics.track('completed_appointment_history_accessed', {
    history_id: medicalHistoryId,
    user_role: userRole,
    appointment_status: appointmentStatus,
    timestamp: new Date().toISOString()
  });
};

// Tracking de exportación de datos
const trackDataExport = (exportType: string, recordCount: number, userRole: string) => {
  analytics.track('completed_appointments_exported', {
    export_type: exportType,
    record_count: recordCount,
    user_role: userRole,
    timestamp: new Date().toISOString()
  });
};
```

## 🔒 Seguridad y Permisos

- **Autorización**: Verificar permisos para ver historial de citas según rol.
- **Validación**: Sanitización de parámetros de consulta.
- **Auditoría**: Logging de acceso a historiales médicos.

Permisos sugeridos:
- `appointments:read_completed`, `appointments:export`
- `medical_history:read`, `medical_history:update`
- `reports:generate` (para exportación)

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
