"use client";
import { useClients } from "@/hooks/use-client";
import { useZoning } from "@/hooks/use-zoning";
import { QuotationStructure } from "@/types";
import { Captions, ChevronDown, ChevronUp, Info, Percent } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

interface HeadQuotationProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    form: UseFormReturn<QuotationStructure>;
    clientIdUpdate?: string;
    zoningIdUpdate?: string;
}

export const HeadQuotation = ({
    form,
    clientIdUpdate,
    zoningIdUpdate,
}: HeadQuotationProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const { dataClientsAll } = useClients();
    const { dataZoningAll } = useZoning();

    // Obtener opciones de cliente
    const clientOptions: Option[] = (dataClientsAll ?? []).map((client) => ({
        value: client.id.toString(),
        label: client.name,
    }));

    const handleClientChange = useCallback(
        (clientId: string) => {
            const selectedClient = clientOptions.find(
                (option) => option.value === clientId,
            );
            if (selectedClient) {
                form.setValue("clientId", selectedClient.value);
            } else {
                form.setValue("clientId", "");
            }
        },
        [clientOptions, form],
    );

    useEffect(() => {
        if (clientIdUpdate && clientOptions.length > 0) {
            handleClientChange(clientIdUpdate);
        }
    }, [clientIdUpdate, clientOptions, handleClientChange]);

    // Obtener opciones de zonificación
    const zoningOptions: Option[] = (dataZoningAll ?? []).map((zoning) => ({
        value: zoning.id.toString(),
        label: zoning.zoneCode,
        buildableArea: zoning.buildableArea.toString(),
        openArea: zoning.openArea.toString(),
    }));

    // Observar cambios en zoningId
    const zoningId = useWatch({
        control: form.control,
        name: "zoningId",
    });

    const selectedZoning = zoningOptions.find(
        (option) => option.value === zoningId,
    );

    const handleZoningChange = useCallback(
        (zoningId: string) => {
            const selectedZoning = zoningOptions.find(
                (option) => option.value === zoningId,
            );
            if (selectedZoning) {
                form.setValue("zoningId", selectedZoning.value);
                form.setValue(
                    "buildableArea",
                    Number(selectedZoning.buildableArea),
                );
                form.setValue("openArea", Number(selectedZoning.openArea));
            } else {
                form.setValue("zoningId", "");
            }
        },
        [zoningOptions, form],
    );

    useEffect(() => {
        if (zoningIdUpdate && zoningOptions.length > 0) {
            handleZoningChange(zoningIdUpdate);
        }
    }, [zoningIdUpdate, zoningOptions, handleZoningChange]);

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="">
                        <div className="flex w-full justify-between">
                            <div
                                className="flex w-full cursor-pointer items-center justify-between"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <div className="flex items-center gap-2">
                                    <Captions size={28} strokeWidth={1.5} />
                                    <span className="text-xl font-bold">
                                        Cabecera de la Cotización
                                    </span>
                                </div>
                                {isOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                {isOpen && (
                    <CardContent>
                        <CollapsibleContent>
                            <div className="flex flex-col gap-6 p-4 sm:p-0">
                                {/* Campo de Nombre del Proyecto */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="name">
                                                Nombre del Proyecto
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="name"
                                                    placeholder="Ingrese el nombre del proyecto"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Campo de Cliente */}
                                <FormField
                                    control={form.control}
                                    name="clientId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="clientId">
                                                Propietario / Cliente
                                            </FormLabel>
                                            <FormControl>
                                                <AutoComplete
                                                    options={clientOptions}
                                                    placeholder="Selecciona un cliente"
                                                    emptyMessage="No se encontraron clientes"
                                                    value={
                                                        clientOptions.find(
                                                            (option) =>
                                                                option.value ===
                                                                field.value,
                                                        ) || undefined
                                                    }
                                                    onValueChange={(option) => {
                                                        field.onChange(
                                                            option?.value || "",
                                                        );
                                                    }}
                                                    className="z-50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Campo de Zonficación */}
                                <FormField
                                    control={form.control}
                                    name="zoningId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="zoningId">
                                                Zonficación
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex flex-row items-center gap-2">
                                                    <div className="w-[95%]">
                                                        <AutoComplete
                                                            options={
                                                                zoningOptions
                                                            }
                                                            placeholder="Selecciona una zonificación"
                                                            emptyMessage="No se encontraron zonificaciones"
                                                            value={
                                                                zoningOptions.find(
                                                                    (option) =>
                                                                        option.value ===
                                                                        field.value,
                                                                ) || undefined
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
                                                    </div>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                disabled={
                                                                    !selectedZoning
                                                                }
                                                            >
                                                                <Info />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80">
                                                            {selectedZoning ? (
                                                                <div className="grid gap-4">
                                                                    <div className="space-y-2">
                                                                        <h4 className="font-medium leading-none">
                                                                            Zonificación:
                                                                        </h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Información
                                                                            acerca
                                                                            de
                                                                            la
                                                                            zonificación
                                                                        </p>
                                                                    </div>
                                                                    <div className="grid gap-2">
                                                                        <div className="grid grid-cols-2 items-center gap-4">
                                                                            <Label htmlFor="buildableArea">
                                                                                Área
                                                                                construible:
                                                                            </Label>
                                                                            <div className="relative">
                                                                                <Input
                                                                                    id="buildableArea"
                                                                                    className="h-8 pr-10"
                                                                                    value={
                                                                                        selectedZoning.buildableArea
                                                                                    }
                                                                                    readOnly
                                                                                />
                                                                                <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-500" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 items-center gap-4">
                                                                            <Label htmlFor="openArea">
                                                                                Área
                                                                                libre:
                                                                            </Label>
                                                                            <div className="relative">
                                                                                <Input
                                                                                    id="openArea"
                                                                                    className="h-8 pr-10"
                                                                                    value={
                                                                                        selectedZoning.openArea
                                                                                    }
                                                                                    readOnly
                                                                                />
                                                                                <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-500" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div></div>
                                                            )}
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Campo de Plazo de Entrega */}
                                <FormField
                                    control={form.control}
                                    name="deliveryTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="deliveryTime">
                                                Plazo de Entrega (Meses)
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex items-center space-x-2">
                                                    <Slider
                                                        id="deliveryTime"
                                                        min={1}
                                                        max={36}
                                                        value={[field.value]}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            field.onChange(
                                                                value[0],
                                                            )
                                                        }
                                                        className="flex-grow"
                                                    />
                                                    <span className="font-normal text-black">
                                                        {field.value}
                                                    </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Campo de Área del Terreno */}
                                <FormField
                                    control={form.control}
                                    name="landArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="landArea">
                                                Área del Terreno (m²)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="landArea"
                                                    type="number"
                                                    placeholder="Ingrese el área en m²"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(
                                                                e.target.value,
                                                            ) || 0,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Campo de Descripción */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="description">
                                                Descripción del Proyecto
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Ingrese una breve descripción del proyecto"
                                                    className="min-h-[100px] transition-all duration-200 ease-in-out focus:min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CollapsibleContent>
                    </CardContent>
                )}
            </Collapsible>
        </Card>
    );
};
