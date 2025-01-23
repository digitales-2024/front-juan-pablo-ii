"use client";

import { departments } from "@/data/department";
import { useClients } from "@/hooks/use-client";
import {
    clientsSchema,
    CreateClientsSchema,
} from "@/schemas/clients/createClientSchema";
import { Client, City } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const infoSheet = {
    title: "Actualizar Cliente",
    description: "Actualiza la información del cliente y guarda los cambios",
};

interface UpdateClientSheetProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Sheet>,
        "open" | "onOpenChange"
    > {
    client: Client;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateClientSheet({
    client,
    open,
    onOpenChange,
}: UpdateClientSheetProps) {
    const { onUpdateClient, isSuccessUpdateClient, isLoadingUpdateClient } =
        useClients();

    const form = useForm<CreateClientsSchema>({
        resolver: zodResolver(clientsSchema),
        defaultValues: {
            name: client.name ?? "",
            rucDni: client.rucDni ?? "",
            phone: client.phone ?? "",
            address: client.address ?? "",
            province: client.province ?? "",
            department: client.department ?? "",
        },
    });

    const [cities, setCities] = useState<City[]>([]);
    const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);

    const departmentOptions: Option[] = departments.map((department) => ({
        value: department.name,
        label: department.name,
    }));

    const handleDepartmentChange = (departmentName: string) => {
        const selectedDepartment = departments.find(
            (dept) => dept.name === departmentName,
        );
        const selectedCities = selectedDepartment?.cities || [];
        setCities(selectedCities);
        setIsDepartmentSelected(true);
        form.setValue("province", "");
    };

    useEffect(() => {
        if (open) {
            form.reset({
                name: client.name ?? "",
                rucDni: client.rucDni ?? "",
                phone: client.phone ?? "",
                address: client.address ?? "",
                province: client.province ?? "",
                department: client.department ?? "",
            });

            const selectedDepartment = departments.find(
                (dept) =>
                    dept.name.toLowerCase() === client.department.toLowerCase(),
            );
            if (selectedDepartment) {
                setCities(selectedDepartment.cities);
                setIsDepartmentSelected(true);

                const selectedCity = selectedDepartment.cities.find(
                    (city) =>
                        city.name.toLowerCase() ===
                        client.province.toLowerCase(),
                );
                form.setValue("department", selectedDepartment.name);
                form.setValue(
                    "province",
                    selectedCity ? selectedCity.name : "",
                );
            }
        }
    }, [open, client, form]);

    const onSubmit = async (input: CreateClientsSchema) => {
        onUpdateClient({
            ...input,
            id: client.id,
        });
    };

    useEffect(() => {
        if (isSuccessUpdateClient) {
            form.reset();
            onOpenChange(false);
        }
    }, [isSuccessUpdateClient, form, onOpenChange]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="flex flex-col gap-6 sm:max-w-md"
                tabIndex={undefined}
            >
                <SheetHeader className="text-left">
                    <SheetTitle className="flex flex-col items-start">
                        {infoSheet.title}
                        <Badge
                            className="bg-emerald-100 capitalize text-emerald-700"
                            variant="secondary"
                        >
                            {client.name}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>{infoSheet.description}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full gap-4 rounded-md border p-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4 p-4"
                        >
                            {/* Nombre */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nombre del Cliente
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="capitalize"
                                                placeholder="Ingrese el nombre del cliente"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* RUC/DNI */}
                            <FormField
                                control={form.control}
                                name="rucDni"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RUC/DNI</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el RUC o DNI"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Dirección */}
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dirección</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="capitalize"
                                                placeholder="Ingrese la dirección"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Departamento */}
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
                                                onValueChange={(
                                                    selectedOption,
                                                ) => {
                                                    field.onChange(
                                                        selectedOption?.value ||
                                                            "",
                                                    );
                                                    handleDepartmentChange(
                                                        selectedOption?.value ||
                                                            "",
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

                            {/* Provincia */}
                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provincia</FormLabel>
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

                            {/* Teléfono */}
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el número de teléfono"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                                <div className="flex flex-row-reverse gap-2">
                                    <Button
                                        type="submit"
                                        disabled={isLoadingUpdateClient}
                                    >
                                        {isLoadingUpdateClient && (
                                            <RefreshCcw
                                                className="mr-2 h-4 w-4 animate-spin"
                                                aria-hidden="true"
                                            />
                                        )}
                                        Actualizar
                                    </Button>
                                    <SheetClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </SheetClose>
                                </div>
                            </SheetFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
