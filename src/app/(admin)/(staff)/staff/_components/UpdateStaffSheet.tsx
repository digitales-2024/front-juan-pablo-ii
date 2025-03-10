"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Staff,
  updateStaffSchema,
  UpdateStaffDto,
} from "../_interfaces/staff.interface";
import { UserResponseDto } from "@/app/(admin)/users/types";
import { PencilIcon, RefreshCcw } from "lucide-react";
import { useStaff } from "../_hooks/useStaff";
import { useStaffTypes } from "../_hooks/useStaffTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { toast } from "sonner";
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth";
import { getUsers } from "@/app/(admin)/users/actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UpdateStaffSheetProps {
  staff: Staff;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function UpdateStaffSheet({
  staff,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: UpdateStaffSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { updateMutation } = useStaff();
  const { staffTypes } = useStaffTypes();
  const { user } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState<UserResponseDto[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [useExistingUser, setUseExistingUser] = useState(!!staff.userId);

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  // Verificar permisos y cargar usuarios
  useEffect(() => {
    // Verificar si el usuario tiene rol SUPER_ADMIN o GERENTE
    const checkPermission = () => {
      const hasAccess =
        user?.isSuperAdmin ??
        user?.roles?.some((role) => role.name === "GERENTE") ??
        false;

      setHasPermission(hasAccess);
      return hasAccess;
    };

    const loadUsers = async () => {
      if (!checkPermission() || !isOpen) return;

      setIsLoadingUsers(true);
      try {
        const usersResponse = await getUsers();

        if (Array.isArray(usersResponse)) {
          // Asegúrate de que TypeScript sepa que es un array de UserResponseDto
          const usersArray = usersResponse as UserResponseDto[];

          // Filtrar usuarios (excluir SUPER_ADMIN y GERENTE)
          const filtered = usersArray.filter((user) => {
            if (user.isSuperAdmin) return false;
            return !user.roles?.some((role) => role.name === "GERENTE");
          });

          setFilteredUsers(filtered);
        } else {
          console.error("Error obteniendo usuarios:", usersResponse.error);
        }
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    void loadUsers();
  }, [user, isOpen]);

  const form = useForm<UpdateStaffDto>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      name: staff.name,
      lastName: staff.lastName,
      dni: staff.dni,
      birth: staff.birth,
      email: staff.email,
      phone: staff.phone ?? "",
      staffTypeId: staff.staffTypeId,
      cmp: staff.cmp ?? "",
      userId: staff.userId ?? "",
    },
  });

  // Manejar selección de usuario existente
  const handleUserSelect = (value: string) => {
    if (value === "none") {
      // Limpiar el userId
      form.setValue("userId", "");
      console.log("userId limpiado:", form.getValues());
      return;
    }

    const selectedUser = filteredUsers.find((user) => user.id === value);

    if (selectedUser) {
      // Actualizar el userId
      form.setValue("userId", selectedUser.id);
      console.log("userId actualizado:", form.getValues());
    }
  };

  // Limpiar userId cuando se desactiva el switch
  const handleToggleChange = (checked: boolean) => {
    setUseExistingUser(checked);

    if (!checked) {
      // Limpiar el userId
      form.setValue("userId", "");
      console.log("userId limpiado por switch:", form.getValues());
    }
  };

  const onSubmit = async (data: UpdateStaffDto) => {
    if (updateMutation.isPending) return;

    // Si useExistingUser está desactivado, asegurar que userId sea null o vacío
    if (!useExistingUser) {
      data.userId = "";
    }

    // Log para depuración
    console.log("Datos a enviar:", data);

    try {
      await updateMutation.mutateAsync(
        {
          id: staff.id,
          data,
        },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
          onError: (error) => {
            console.error("Error al actualizar personal:", error);
            toast.error(error.message || "Error al actualizar el personal");
          },
        }
      );
    } catch (error) {
      console.error("Error en onSubmit:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <PencilIcon className="size-4" aria-hidden="true" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="sm:max-w-[550px] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg">Actualizar Personal</SheetTitle>
          <SheetDescription className="text-sm">
            Actualiza la información del personal y guarda los cambios
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 overflow-y-auto pr-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Sección de usuario - solo visible con permisos */}
              {hasPermission && (
                <div className="flex flex-col space-y-4 border-b pb-4 mb-4">
                  <div className="flex items-center justify-between space-x-2 w-full">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="use-existing-user"
                        checked={useExistingUser}
                        onCheckedChange={handleToggleChange}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Label
                        htmlFor="use-existing-user"
                        className="text-sm sm:text-base font-medium"
                      >
                        Asignar usuario existente
                      </Label>
                    </div>
                  </div>

                  {useExistingUser && (
                    <div className="w-full">
                      <FormLabel className="text-sm sm:text-base mb-2 block">
                        Seleccionar usuario
                      </FormLabel>
                      <Select
                        onValueChange={handleUserSelect}
                        defaultValue={staff.userId || "none"} // Asegúrate que esto sea correcto
                        value={form.watch("userId") || "none"} // Añadir esto para mantener sincronizado el valor
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione un usuario" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          position="popper"
                          className="max-h-[300px] overflow-y-auto w-[min(calc(100vw-2rem),350px)] sm:w-[350px]"
                          align="start"
                        >
                          <SelectItem value="none">Ninguno</SelectItem>
                          {isLoadingUsers ? (
                            <SelectItem value="loading" disabled>
                              Cargando usuarios...
                            </SelectItem>
                          ) : (
                            filteredUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="truncate">
                                  {user.name} - {user.email}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {user.roles?.[0]?.name || "Sin rol"}
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                        Asigna un usuario del sistema a este personal.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Campos existentes del formulario */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Resto de campos... */}
                {/* Puedes presentar el resto de campos en 2 columnas para mejor visualización */}
                <FormField
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="12345678"
                          maxLength={8}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="juan.perez@ejemplo.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono (opcional)</FormLabel>
                      <FormControl>
                        <PhoneInput placeholder="999888777" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="staffTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Personal</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tipo de personal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {staffTypes?.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cmp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CMP (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de colegiatura" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Campo oculto para userId */}
              <input type="hidden" {...form.register("userId")} />

              <SheetFooter>
                <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </SheetClose>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <>
                        <RefreshCcw className="mr-2 size-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar"
                    )}
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
