"use client";
import { departments } from "@/data/department";
import { CreateClientsSchema } from "@/schemas/clients/createClientSchema";
import { City } from "@/types";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { AutoComplete, type Option } from "../ui/autocomplete";
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

interface CreateClientsFormProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    children: React.ReactNode;
    form: UseFormReturn<CreateClientsSchema>;
    onSubmit: (data: CreateClientsSchema) => void;
}

export const CreateClientsForm = ({
    children,
    form,
    onSubmit,
}: CreateClientsFormProps) => {
    // Estado para almacenar las ciudades del departamento seleccionado
    const [cities, setCities] = useState<City[]>([]);
    const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);

    // Prepara las opciones para el AutoComplete
    const departmentOptions: Option[] = departments.map((department) => ({
        value: department.name,
        label: department.name,
    }));

    // Manejar el cambio de departamento
    const handleDepartmentChange = (departmentName: string) => {
        const selectedDepartment = departments.find(
            (dept) => dept.name === departmentName,
        );
        const selectedCities = selectedDepartment?.cities || [];
        setCities(selectedCities);
        setIsDepartmentSelected(true);
        // Resetear el campo de ciudad cuando se cambia el departamento
        form.setValue("province", "");
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-1"
            >
                <div className="flex flex-col gap-6 p-4 sm:p-0">
                    {/* Campo de Nombre */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name">
                                    Nombre del Cliente
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        placeholder="Ingrese el nombre del cliente"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Campo de RUC/DNI */}
                    <FormField
                        control={form.control}
                        name="rucDni"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="rucDni">RUC/DNI</FormLabel>
                                <FormControl>
                                    <Input
                                        id="rucDni"
                                        placeholder="Ingrese el RUC o DNI"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Campo de Dirección */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="address">
                                    Dirección
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="address"
                                        placeholder="Ingrese la dirección"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Campo de Departamento */}
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Departamento</FormLabel>
                                <FormControl>
                                    <AutoComplete
                                        options={departmentOptions}
                                        emptyMessage="No se encontró el departamento."
                                        placeholder="Seleccione un departamento"
                                        onValueChange={(selectedOption) => {
                                            field.onChange(
                                                selectedOption?.value || "",
                                            );
                                            handleDepartmentChange(
                                                selectedOption?.value || "",
                                            );
                                        }}
                                        value={
                                            departmentOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) || undefined
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Campo de Ciudad */}
                    <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="city">Provincia</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={!isDepartmentSelected}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione una provincia" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            {cities.map((city) => (
                                                <SelectItem
                                                    key={city.id.toString()}
                                                    value={city.name}
                                                >
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Campo de Teléfono */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="phone">Teléfono</FormLabel>
                                <FormControl>
                                    <Input
                                        id="phone"
                                        placeholder="Ingrese el número de teléfono"
                                        {...field}
                                    />
                                </FormControl>
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
