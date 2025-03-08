"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateStaffDto } from "../_interfaces/staff.interface";
import { UserResponseDto } from "@/app/(admin)/users/types"; // Ajusta la ruta según tu proyecto
// Resto de importaciones sin cambios
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaffTypes } from "../_hooks/useStaffTypes";
import { PhoneInput } from "@/components/ui/phone-input";
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth";
import { useEffect, useState } from "react";
import { getUsers } from "@/app/(admin)/users/actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CreateStaffFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateStaffDto>;
  onSubmit: (data: CreateStaffDto) => void;
}

export function CreateStaffForm({
  children,
  form,
  onSubmit,
}: CreateStaffFormProps) {
  const { staffTypes } = useStaffTypes();
  const { user } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState<UserResponseDto[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [useExistingUser, setUseExistingUser] = useState(false);

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
      if (!checkPermission()) return;
    
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
          console.log("Usuarios filtrados:", filtered);
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
  }, [user]);

  // Manejar selección de usuario existente
  // Actualiza la función handleUserSelect
  const handleUserSelect = (value: string) => {
    if (value === "none") {
      // Limpiar los campos
      form.setValue("name", "");
      form.setValue("email", "");
      form.setValue("phone", "");
      form.setValue("userId", "");
      return;
    }

    const selectedUser = filteredUsers.find((user) => user.id === value);

    if (selectedUser) {
      // Autocompletar campos del formulario con datos del usuario
      form.setValue("name", selectedUser.name || "");
      form.setValue("email", selectedUser.email || "");
      form.setValue("phone", selectedUser.phone ?? "");
      form.setValue("userId", selectedUser.id);
    }
  };

  // Limpiar los datos del usuario cuando se desactiva el switch
  const handleToggleChange = (checked: boolean) => {
    setUseExistingUser(checked);

    if (!checked) {
      // Limpiar los campos relevantes
      form.setValue("name", "");
      form.setValue("email", "");
      form.setValue("phone", "");
      form.setValue("userId", "");
    }
  };

  return (
    <Form {...form}>
      <form
        id="create-staff-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Opción para seleccionar usuario existente (solo visible con permisos) */}
        {hasPermission && (
          <div className="flex flex-col space-y-4 border-b pb-4 mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="use-existing-user"
                checked={useExistingUser}
                onCheckedChange={handleToggleChange}
              />
              <Label htmlFor="use-existing-user">
                Asignar usuario existente
              </Label>
            </div>

            {useExistingUser && (
              <div>
                <FormLabel>Seleccionar usuario</FormLabel>
                <Select onValueChange={handleUserSelect}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un usuario" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Ninguno</SelectItem>
                    {isLoadingUsers ? (
                      <SelectItem value="loading" disabled>
                        Cargando usuarios...
                      </SelectItem>
                    ) : (
                      filteredUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} - {user.email} (
                          {user.roles?.[0]?.name || "Sin rol"})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Al seleccionar un usuario, algunos campos se completarán
                  automáticamente.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Resto del formulario existente */}
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

          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI</FormLabel>
                <FormControl>
                  <Input placeholder="12345678" maxLength={8} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cmp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código CMP</FormLabel>
                <FormControl>
                  <Input placeholder="98676278" maxLength={10} {...field} />
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
                      <SelectValue placeholder="Seleccione un tipo" />
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
        </div>
        {children}
      </form>
    </Form>
  );
}
