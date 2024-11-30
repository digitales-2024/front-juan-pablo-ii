import { departments } from "@/data/department";
import { useDesignProject } from "@/hooks/use-design-project";
import { useUsers } from "@/hooks/use-users";
import { City, User } from "@/types";
import {
    DesignProjectData,
    DesignProjectSummaryData,
} from "@/types/designProject";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AutoComplete, type Option } from "@/components/ui/autocomplete";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import DatePicker from "../ui/date-time-picker";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";

const FormSchema = z.object({
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

export function EditDesignProjectSheet(props: {
    id: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: DesignProjectSummaryData;
}) {
    const { data } = useUsers();
    const { designProjectById: project } = useDesignProject({ id: props.id });

    // Filtrar superadmin
    const usersData = data?.filter((user) => !user.isSuperAdmin) ?? [];

    return (
        <Sheet open={props.open} onOpenChange={props.onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex flex-col items-start gap-2">
                        Editar Proyecto de Diseño
                        <Badge
                            className="bg-emerald-100 capitalize text-emerald-700"
                            variant="secondary"
                        >
                            {props.project.code}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>
                        Actualiza la información del proyecto y guarda los
                        cambios.
                    </SheetDescription>

                    {!usersData && !project && <p>Cargando recursos...</p>}
                    {!!usersData && !!project && (
                        <FormWrapper
                            project={project}
                            usersData={usersData}
                            onOpenChange={props.onOpenChange}
                        />
                    )}
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}

function FormWrapper(props: {
    project: DesignProjectData;
    usersData: User[];
    onOpenChange: (open: boolean) => void;
}) {
    const { project, usersData, onOpenChange } = props;
    const { onEditProject, editLoading, editSuccess } = useDesignProject();

    // Estado para almacenar las ciudades del departamento seleccionado
    const [cities, setCities] = useState<City[]>(
        departments.find((dept) => dept.name === project.department)?.cities ??
            [],
    );
    const [isDepartmentSelected, setIsDepartmentSelected] = useState(true);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            department: project.department,
            province: project.province,
            designerId: project.designer.id,
            address: project.ubicationProject,
            startDate: project.startProjectDate,
        },
    });

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

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        await onEditProject({
            body: {
                province: formData.province,
                department: formData.department,
                designerId: formData.designerId,
                ubicationProject: formData.address,
                startProjectDate: formData.startDate,
            },
            id: project.id,
        });
    }

    useEffect(() => {
        if (editSuccess) {
            onOpenChange(false);
        }
    }, [editSuccess, form, onOpenChange]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6 p-4 sm:p-0">
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
                                        options={usersOptions}
                                        placeholder="Selecciona un diseñador"
                                        emptyMessage="No se encontraron diseñadores"
                                        value={
                                            usersOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) || undefined
                                        }
                                        onValueChange={(option) => {
                                            field.onChange(option?.value || "");
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
                                <FormLabel>Departamento</FormLabel>
                                <FormControl>
                                    <AutoComplete
                                        options={departmentOptions}
                                        emptyMessage="No se encontró el departamento."
                                        placeholder="Seleccione un departamento"
                                        onValueChange={(selectedOption: {
                                            value?: string;
                                        }) => {
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
                        render={({ field }) => {
                            console.log(field.value);
                            return (
                                <FormItem>
                                    <FormLabel htmlFor="city">
                                        Provincia
                                    </FormLabel>
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
                            );
                        }}
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
                                    Fecha de inicio de proyecto
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
                                        onChange={(date) => {
                                            if (date) {
                                                const formattedDate = format(
                                                    date,
                                                    "yyyy-MM-dd",
                                                );
                                                field.onChange(formattedDate);
                                            } else {
                                                field.onChange("");
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
                        disabled={!form.formState.isDirty || editLoading}
                    >
                        Editar Proyecto de Diseño
                    </Button>
                </div>
            </form>
        </Form>
    );
}
