import { Floor, QuotationStructure } from "@/types";
import { Edit2, Trash, Plus, Copy } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

import { SpaceForm } from "./SpaceForm";

interface LevelAccordionItemProps {
    floor: Floor;
    floorIndex: number;
    deleteFloor: (floorIndex: number) => void;
    changeFloorName: (floorIndex: number, newName: string) => void;
    updateSpace: (
        floorIndex: number,
        spaceIndex: number,
        field: "name" | "meters" | "amount" | "selected" | "spaceId",
        value: string | number | boolean,
    ) => void;
    addSpace: (floorIndex: number) => void;
    calculateTotalMeters: (floor: Floor) => number;
    duplicateFloor: (floorIndex: number) => void;
    deleteSelectedSpaces: (floorIndex: number) => void;
    form: UseFormReturn<QuotationStructure>;
}

export function LevelAccordionItem({
    floor,
    floorIndex,
    deleteFloor,
    changeFloorName,
    updateSpace,
    addSpace,
    calculateTotalMeters,
    duplicateFloor,
    deleteSelectedSpaces,
    form,
}: LevelAccordionItemProps) {
    const [newName, setNewName] = useState(floor.name);
    const [dialogOpen, setDialogOpen] = useState(false);

    const selectedSpacesCount = floor.spaces.filter(
        (space) => space.selected,
    ).length;

    return (
        <AccordionItem
            key={floor.number}
            value={`floor-${floor.number}`}
            className=""
        >
            <AccordionTrigger>
                <div className="flex w-full items-center justify-between">
                    <span>{floor.name}</span>
                </div>
            </AccordionTrigger>
            <div className="relative">
                <div className="absolute bottom-2 right-6 flex items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => setDialogOpen(true)}
                                    type="button"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Editar nivel</span>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => duplicateFloor(floor.number)}
                                    type="button"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Duplicar nivel</span>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => deleteFloor(floor.number)}
                                    type="button"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Eliminar nivel</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <></>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cambiar nombre del nivel</DialogTitle>
                        <DialogDescription>
                            Ingrese el nuevo nombre para el nivel.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nuevo nombre del nivel"
                    />
                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setNewName(floor.name);
                                setDialogOpen(false);
                            }}
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="default"
                            className="ml-2"
                            onClick={() => {
                                changeFloorName(floor.number, newName);
                                setDialogOpen(false);
                            }}
                            type="button"
                        >
                            Aceptar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <AccordionContent className="z-[999] h-fit">
                <Card>
                    <CardContent className="p-4">
                        <div className="mb-6">
                            <div className="flex flex-col gap-4 xl:flex-row">
                                <Button
                                    type="button"
                                    onClick={() => addSpace(floorIndex)}
                                >
                                    <Plus className="mr-2" /> Añadir ambiente
                                </Button>
                                {selectedSpacesCount > 0 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() =>
                                            deleteSelectedSpaces(floorIndex)
                                        }
                                    >
                                        <Trash className="mr-2" />
                                        Eliminar ambientes (
                                        {selectedSpacesCount})
                                    </Button>
                                )}
                            </div>
                        </div>
                        {floor.spaces.map((space, environmentIndex) => (
                            <SpaceForm
                                key={environmentIndex}
                                space={space}
                                floorIndex={floorIndex}
                                environmentIndex={environmentIndex}
                                updateEnvironment={updateSpace}
                                form={form}
                            />
                        ))}
                        <div className="mt-4 text-right">
                            <strong>
                                Total m² del nivel:{" "}
                                {calculateTotalMeters(floor)}
                            </strong>
                        </div>
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
    );
}
