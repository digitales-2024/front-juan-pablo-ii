import { departments } from "@/data/department";
import { useDesignProject } from "@/hooks/use-design-project";
import { useUsers } from "@/hooks/use-users";
import { useGetCreatableQuotationsQuery } from "@/redux/services/quotationApi";
import { City } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { parse, format } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
    quotationId: z.string({
        message: "Debes seleccionar una cotización",
    }),
    department: z.string({
        message: "Selecciona el departamento",
    }),
    province: z.string({
        message: "Selecciona la provincia",
    }),
    designerId: z.string({
        message: "Debes seleccionar un diseñador",
    }),
    address: z
        .string({
            message: "Ingresa la dirección del proyecto",
        })
        .min(2, {
            message: "La dirección del proyecto debe tener al menos 2 letras",
        }),
    startDate: z.string({
        message: "Ingresa la fecha de inicio del proyecto",
    }),
});

export function CreateProjectDialog() {
    const [open, setOpen] = useState(false);
    const { data, isLoading, isError } = useGetCreatableQuotationsQuery();
    const { onCreateProject, createLoading, createSuccess } =
        useDesignProject();
    const { data: usersDataUnfiltered } = useUsers();

    // Filtrar superadmin
    const usersData =
        usersDataUnfiltered?.filter((user) => !user.isSuperAdmin) ?? [];

    // Estado para almacenar las ciudades del departamento seleccionado
    const [cities, setCities] = useState<City[]>([]);
    const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);

    // Prepara las opciones para el AutoComplete
    const departmentOptions: Option[] = departments.map((department) => ({
        value: department.name,
        label: department.name,
    }));

    const usersOptions: Option[] = (usersData ?? []).map((user) => ({
        value: user.id.toString(),
        label: user.name,
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

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            address: "",
            startDate: "",
        },
    });

    useEffect(() => {
        if (createSuccess) {
            form.reset();
            setOpen(false);
        }
    }, [createSuccess, form]);

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        const quotation = data?.find((q) => q.id === formData.quotationId);
        if (!quotation) {
            alert("Cotizacion invalida");
            return;
        }

        await onCreateProject({
            name: quotation.name,
            ubicationProject: formData.address,
            province: formData.province,
            department: formData.department,
            clientId: quotation.client.id,
            quotationId: formData.quotationId,
            designerId: formData.designerId,
            startProjectDate: formData.startDate,
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 size-4" aria-hidden="true" />
                    Crear Proyecto
                </Button>
            </DialogTrigger>
            <DialogContent>
                {isLoading && <DialogLoading />}
                {isError && <DialogError />}
                {data && data.length === 0 && <DialogEmpty />}
                {data && data.length > 0 && (
                    <DialogHeader>
                        <DialogTitle>Crear un proyecto de diseño</DialogTitle>
                        <DialogDescription>
                            Seleccione una cotización aprobada y presione el
                            boton Crear.
                        </DialogDescription>
                        {data && data.length > 0 && (
                            <div>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                    >
                                        <div className="flex flex-col gap-6 p-4 sm:p-0">
                                            <FormField
                                                control={form.control}
                                                name="quotationId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Cotización
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="">
                                                                    <SelectValue placeholder="Selecciona un diseño" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {data.map(
                                                                    (q) => (
                                                                        <SelectItem
                                                                            key={
                                                                                q.id
                                                                            }
                                                                            value={
                                                                                q.id
                                                                            }
                                                                        >
                                                                            {
                                                                                q.name
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="designerId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="designerId">
                                                            Diseñador
                                                        </FormLabel>
                                                        <FormControl>
                                                            <AutoComplete
                                                                options={
                                                                    usersOptions
                                                                }
                                                                placeholder="Selecciona un diseñador"
                                                                emptyMessage="No se encontraron diseñadores"
                                                                value={
                                                                    usersOptions.find(
                                                                        (
                                                                            option,
                                                                        ) =>
                                                                            option.value ===
                                                                            field.value,
                                                                    ) ||
                                                                    undefined
                                                                }
                                                                onValueChange={(
                                                                    option,
                                                                ) => {
                                                                    field.onChange(
                                                                        option?.value ||
                                                                            "",
                                                                    );
                                                                }}
                                                                className="z-50"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Campo de Departamento */}
                                            <FormField
                                                control={form.control}
                                                name="department"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Departamento
                                                        </FormLabel>
                                                        <FormControl>
                                                            <AutoComplete
                                                                options={
                                                                    departmentOptions
                                                                }
                                                                emptyMessage="No se encontró el departamento."
                                                                placeholder="Seleccione un departamento"
                                                                onValueChange={(selectedOption: {
                                                                    value?: string;
                                                                }) => {
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
                                                                        (
                                                                            option,
                                                                        ) =>
                                                                            option.value ===
                                                                            field.value,
                                                                    ) ||
                                                                    undefined
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
                                                        <FormLabel htmlFor="city">
                                                            Provincia
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            value={field.value}
                                                            disabled={
                                                                !isDepartmentSelected
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleccione una provincia" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {cities.map(
                                                                        (
                                                                            city,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={city.id.toString()}
                                                                                value={
                                                                                    city.name
                                                                                }
                                                                            >
                                                                                {
                                                                                    city.name
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

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
                                                                placeholder="Dirección del proyecto"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="startDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="startDate">
                                                            Fecha de inicio de
                                                            proyecto
                                                        </FormLabel>
                                                        <FormControl>
                                                            <DatePicker
                                                                value={
                                                                    field.value
                                                                        ? parse(
                                                                              field.value,
                                                                              "yyyy-MM-dd",
                                                                              new Date(),
                                                                          )
                                                                        : undefined
                                                                }
                                                                onChange={(
                                                                    date,
                                                                ) => {
                                                                    if (date) {
                                                                        const formattedDate =
                                                                            format(
                                                                                date,
                                                                                "yyyy-MM-dd",
                                                                            );
                                                                        field.onChange(
                                                                            formattedDate,
                                                                        );
                                                                    } else {
                                                                        field.onChange(
                                                                            "",
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                className="mt-4"
                                                disabled={
                                                    !form.formState.isDirty ||
                                                    createLoading
                                                }
                                            >
                                                Crear Proyecto de Diseño
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        )}
                    </DialogHeader>
                )}
            </DialogContent>
        </Dialog>
    );
}

function DialogLoading() {
    return <>Loading...</>;
}

function DialogError() {
    return (
        <div className="text-red-500">
            Hubo un error cargando las cotizaciones disponibles
        </div>
    );
}

function DialogEmpty() {
    return (
        <>
            <DialogTitle>No hay cotizaciones listas</DialogTitle>
            <p className="text-sm text-muted-foreground">
                No hay ninguna cotizacion aprobada y que no esté vinculada a
                otro proyecto de diseño.
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <Button>
                    <Link href="/design-project/quotation">
                        Ir a cotizaciones
                    </Link>
                </Button>
            </div>
        </>
    );
}
