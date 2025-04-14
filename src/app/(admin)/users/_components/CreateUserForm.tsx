"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { UserCreateDto } from "../types";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generatePassword } from "../utils";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { Bot, AlertTriangle } from "lucide-react";
import { useRoles } from "../../roles/_hooks/useRoles";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateUsersFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<UserCreateDto>;
  onSubmit: (data: UserCreateDto) => void;
}

export default function CreateUserForm({
  children,
  form,
  onSubmit,
}: CreateUsersFormProps) {
  const handleGeneratePassword = () => {
    form.setValue("password", generatePassword());
  };

  const { data, isLoading } = useRoles();
  const [showSuperAdminWarning, setShowSuperAdminWarning] = useState(false);
  const [pendingRoleSelection, setPendingRoleSelection] = useState<
    string | null
  >(null);

  const roles = data && !("error" in data) ? data : [];

  const handleRoleSelection = (value: string) => {
    const selectedRole = roles.find((rol) => rol.id === value);

    if (selectedRole && selectedRole.name === "SUPER_ADMIN") {
      setPendingRoleSelection(value);
      setShowSuperAdminWarning(true);
    } else {
      form.setValue("roles", [value]);
    }
  };

  const confirmSuperAdminSelection = () => {
    if (pendingRoleSelection) {
      form.setValue("roles", [pendingRoleSelection]);
    }
    setShowSuperAdminWarning(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-6 p-4 sm:p-0">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Nombre completo</FormLabel>
                <FormControl>
                  <Input id="name" {...field} />
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
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="usuario@juanpabloii.com"
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
                <FormLabel htmlFor="phone">Teléfono</FormLabel>
                <FormControl>
                  <PhoneInput defaultCountry="PE" id="phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Generar contraseña</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input id="password" {...field} />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleGeneratePassword}
                          >
                            <Bot className="size-4" aria-hidden="true" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Generar constraseña</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roles"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="rol">Rol</FormLabel>
                <Select
                  onValueChange={handleRoleSelection}
                  defaultValue={field.value[0] || ""}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {roles?.map((rol) => (
                        <SelectItem
                          key={rol.id}
                          value={rol.id}
                          className="capitalize"
                        >
                          {rol.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Dialog
          open={showSuperAdminWarning}
          onOpenChange={setShowSuperAdminWarning}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Advertencia: Rol Super Administrador
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Crear otro usuario con Rol de  SUPER_ADMIN queda bajo su
              completa responsabilidad. Este rol tiene acceso total al sistema.
            </DialogDescription>
            <DialogFooter>
              <Button onClick={confirmSuperAdminSelection}>
                Entiendo y deseo continuar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {children}
      </form>
    </Form>
  );
}
