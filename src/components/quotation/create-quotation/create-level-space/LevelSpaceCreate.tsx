"use client";

import { Floor, LevelQuotation, QuotationStructure } from "@/types";
import { Plus, ChevronDown, ChevronUp, BrickWall } from "lucide-react";
import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { DesignSummary } from "./DesignSummary";
import { LevelAccordionItem } from "./LevelAccordionItem";

interface CreateLevelSpaceProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    form: UseFormReturn<QuotationStructure>;
    floors: Floor[];
    setFloors: React.Dispatch<React.SetStateAction<Floor[]>>;
    calculateTotalBuildingMeters: () => number;
}

export function extractData(floors: Floor[]): LevelQuotation[] {
    return floors.map((floor) => ({
        name: floor.name,
        spaces: floor.spaces.map((space) => ({
            amount: space.amount,
            area: space.meters,
            spaceId: space.spaceId || "",
        })),
    }));
}

export function CreateLevelSpace({
    form,
    floors,
    setFloors,
    calculateTotalBuildingMeters,
}: CreateLevelSpaceProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const addFloor = () => {
        const maxNumber =
            floors.length > 0
                ? Math.max(...floors.map((floor) => floor.number))
                : 0;
        setFloors([
            ...floors,
            {
                number: maxNumber + 1,
                name: `Nivel ${maxNumber + 1}`,
                spaces: [],
                expanded: true,
            },
        ]);
    };

    const deleteSelectedSpaces = (floorIndex: number) => {
        const newFloors = floors.map((floor, idx) => {
            if (idx === floorIndex) {
                return {
                    ...floor,
                    spaces: floor.spaces.filter((space) => !space.selected),
                };
            }
            return floor;
        });
        setFloors(newFloors);
    };

    const duplicateFloor = (floorNumber: number) => {
        const floorToDuplicate = floors.find(
            (floor) => floor.number === floorNumber,
        );
        if (floorToDuplicate) {
            const maxNumber =
                floors.length > 0
                    ? Math.max(...floors.map((floor) => floor.number))
                    : 0;
            const newFloor: Floor = {
                ...floorToDuplicate,
                number: maxNumber + 1,
                name: `Nivel ${maxNumber + 1}`,
                expanded: false,
            };
            setFloors([...floors, newFloor]);
        }
    };

    const deleteFloor = (floorId: number) => {
        setFloors(floors.filter((floor) => floor.number !== floorId));
    };

    const addSpace = (floorIndex: number) => {
        const newFloors = floors.map((floor, idx) => {
            if (idx === floorIndex) {
                return {
                    ...floor,
                    spaces: [
                        ...floor.spaces,
                        {
                            spaceId: "",
                            name: "",
                            meters: 0,
                            amount: 1,
                            selected: false,
                        },
                    ],
                };
            }
            return floor;
        });
        setFloors(newFloors);
    };

    const updateSpace = useCallback(
        (
            floorIndex: number,
            spaceIndex: number,
            field: "name" | "meters" | "amount" | "selected" | "spaceId",
            value: string | number | boolean,
        ) => {
            setFloors((prevFloors) =>
                prevFloors.map((floor, idx) => {
                    if (idx === floorIndex) {
                        const updatedSpaces = floor.spaces.map(
                            (space, index) =>
                                index === spaceIndex
                                    ? { ...space, [field]: value }
                                    : space,
                        );
                        return { ...floor, spaces: updatedSpaces };
                    }
                    return floor;
                }),
            );
        },
        [setFloors],
    );

    const changeFloorName = (floorNumber: number, newName: string) => {
        const newFloors = floors.map((floor) => {
            if (floor.number === floorNumber) {
                return { ...floor, name: newName };
            }
            return floor;
        });
        setFloors(newFloors);
    };

    const calculateTotalMeters = (floor: Floor) => {
        return floor.spaces.reduce((total, space) => total + space.meters, 0);
    };

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader>
                        <div className="flex w-full justify-between">
                            <div
                                className="flex w-full cursor-pointer items-center justify-between"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <div className="flex items-center gap-2">
                                    <BrickWall size={28} strokeWidth={1.5} />
                                    <span className="text-xl font-bold">
                                        Definir niveles y ambientes
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
                            <div className="container mx-auto p-4">
                                <div className="mb-6 flex flex-wrap gap-4">
                                    <Button onClick={addFloor} type="button">
                                        <Plus className="mr-2" /> Agregar Nivel
                                    </Button>
                                </div>
                                <div className={`grid grid-cols-1 gap-6`}>
                                    <div className="space-y-6">
                                        <Accordion
                                            type="multiple"
                                            className="w-full"
                                        >
                                            {floors.map((floor, floorIndex) => (
                                                <LevelAccordionItem
                                                    key={floor.number}
                                                    floor={floor}
                                                    floorIndex={floorIndex}
                                                    deleteFloor={deleteFloor}
                                                    changeFloorName={
                                                        changeFloorName
                                                    }
                                                    updateSpace={updateSpace}
                                                    addSpace={addSpace}
                                                    calculateTotalMeters={
                                                        calculateTotalMeters
                                                    }
                                                    duplicateFloor={
                                                        duplicateFloor
                                                    }
                                                    deleteSelectedSpaces={
                                                        deleteSelectedSpaces
                                                    }
                                                    form={form}
                                                />
                                            ))}
                                        </Accordion>
                                    </div>
                                    <div className="sticky top-4 h-fit">
                                        <DesignSummary
                                            floors={floors}
                                            calculateTotalMeters={
                                                calculateTotalMeters
                                            }
                                            calculateTotalBuildingMeters={
                                                calculateTotalBuildingMeters
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </CardContent>
                )}
            </Collapsible>
        </Card>
    );
}
