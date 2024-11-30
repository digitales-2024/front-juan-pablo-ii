"use client";

import { useSpaces } from "@/hooks/use-space";
import { QuotationStructure, Space } from "@/types";
import * as React from "react";
import { UseFormReturn } from "react-hook-form";

import { AutoComplete } from "@/components/ui/autocomplete";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SpaceFormProps {
    space: Space;
    floorIndex: number;
    environmentIndex: number;
    updateEnvironment: (
        floorIndex: number,
        environmentIndex: number,
        field: "name" | "meters" | "amount" | "selected" | "spaceId",
        value: string | number | boolean,
    ) => void;
    form: UseFormReturn<QuotationStructure>;
}

export function SpaceForm({
    space,
    floorIndex,
    environmentIndex,
    updateEnvironment,
    form,
}: SpaceFormProps) {
    const { dataSpacesAll = [] } = useSpaces();
    const [selectedSpaceId, setSelectedSpaceId] = React.useState<string>(
        space.spaceId || "",
    );
    const [selectedSpaceName, setSelectedSpaceName] = React.useState<string>(
        space.name,
    );
    const [amount, setAmount] = React.useState<number>(space.amount || 1);
    const [meters, setMeters] = React.useState<number>(space.meters);
    const [isSelected, setIsSelected] = React.useState<boolean>(
        space.selected || false,
    );

    React.useEffect(() => {
        setIsSelected(space.selected || false);
    }, [space.selected]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Number(e.target.value));
        setAmount(value);
        updateEnvironment(floorIndex, environmentIndex, "amount", value);
    };

    const handleMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number(e.target.value));
        setMeters(value);
        updateEnvironment(floorIndex, environmentIndex, "meters", value);
    };

    const handleCheckboxChange = (checked: boolean) => {
        setIsSelected(checked);
        updateEnvironment(floorIndex, environmentIndex, "selected", checked);
    };

    const handleSpaceChange = (option: { value: string; label: string }) => {
        setSelectedSpaceId(option.value);
        setSelectedSpaceName(option.label);
        updateEnvironment(
            floorIndex,
            environmentIndex,
            "spaceId",
            option.value,
        );
        updateEnvironment(floorIndex, environmentIndex, "name", option.label);
    };

    return (
        <div className="grid grid-cols-1 items-center gap-2 pb-4">
            <div className="flex flex-row items-end justify-end gap-2">
                <Checkbox
                    id={`checkbox-${floorIndex}-${environmentIndex}`}
                    checked={isSelected}
                    onCheckedChange={handleCheckboxChange}
                    className="mb-4"
                />
                <div>
                    <FormField
                        control={form.control}
                        name={`levels.${floorIndex}.spaces.${environmentIndex}.amount`}
                        render={({ field }) => (
                            <FormItem>
                                <Label
                                    className="truncate"
                                    htmlFor={`amount-${floorIndex}-${environmentIndex}`}
                                >
                                    Cantidad
                                </Label>
                                <Input
                                    id={`amount-${floorIndex}-${environmentIndex}`}
                                    type="number"
                                    value={amount}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        field.onChange(value);
                                        handleAmountChange(e);
                                    }}
                                    placeholder="Cantidad"
                                    className="max-w-[70px]"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="w-full">
                    <FormField
                        control={form.control}
                        name={`levels.${floorIndex}.spaces.${environmentIndex}.spaceId`}
                        render={({ field }) => (
                            <FormItem>
                                <Label
                                    className="truncate"
                                    htmlFor={`space-${floorIndex}-${environmentIndex}`}
                                >
                                    Espacio
                                </Label>
                                <AutoComplete
                                    options={dataSpacesAll.map((spaceItem) => ({
                                        value: spaceItem.id,
                                        label: spaceItem.name,
                                    }))}
                                    placeholder="Selecciona un espacio"
                                    emptyMessage="No se encontraron espacios"
                                    value={{
                                        value: selectedSpaceId,
                                        label: selectedSpaceName,
                                    }}
                                    onValueChange={(value) => {
                                        field.onChange(value.value);
                                        handleSpaceChange(value);
                                    }}
                                    className="z-50"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name={`levels.${floorIndex}.spaces.${environmentIndex}.area`}
                        render={({ field }) => (
                            <FormItem>
                                <Label
                                    className="truncate"
                                    htmlFor={`meters-${floorIndex}-${environmentIndex}`}
                                >
                                    Área (m²)
                                </Label>
                                <Input
                                    id={`meters-${floorIndex}-${environmentIndex}`}
                                    type="number"
                                    value={meters}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        field.onChange(value);
                                        handleMetersChange(e);
                                    }}
                                    placeholder="m²"
                                    className="max-w-[70px]"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
