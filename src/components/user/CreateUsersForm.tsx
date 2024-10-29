"use client";
import { useRol } from "@/hooks/use-rol";
import { useUsers } from "@/hooks/use-users";
import { CreateUsersSchema } from "@/schemas";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Bot } from "lucide-react";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface CreateUsersFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateUsersSchema>;
  onSubmit: (data: CreateUsersSchema) => void;
}

export const CreateUsersForm = ({
  children,
  form,
  onSubmit,
}: CreateUsersFormProps) => {
  const { dataRoles } = useRol();
  const { handleGeneratePassword, password } = useUsers();
  const { setValue, clearErrors } = form;

  useEffect(() => {
    if (password) {
      setValue("password", password?.password);
      clearErrors("password");
    }
  }, [password, setValue, clearErrors]);

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
                  <Input
                    id="name"
                    placeholder="Ejemplo: john smith"
                    {...field}
                  />
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
                    placeholder="Ejemplo: admin@chaqchao.com"
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
                  <Input
                    id="phone"
                    placeholder="Ejemplo: 999 999 999"
                    {...field}
                  />
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
                    <Input id="password" placeholder="********" {...field} />
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
                  onValueChange={(value) => field.onChange([value])}
                  defaultValue={field.value[0] || ""}
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {dataRoles?.map((rol) => (
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
        {children}
      </form>
    </Form>
  );
};
