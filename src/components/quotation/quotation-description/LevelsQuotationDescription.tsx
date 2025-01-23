"use client";

import { LevelQuotation } from "@/types";
import { Layers, Maximize2, Home } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SpaceCardQuotationDescription from "./SpaceCardQuotationDescription";

interface LevelsQuotationDescriptionProps {
    levelData: LevelQuotation[];
}

export default function LevelsQuotationDescription({
    levelData,
}: LevelsQuotationDescriptionProps) {
    const [activeLevel, setActiveLevel] = useState(levelData[0].name);

    const totalArea = levelData.reduce(
        (sum, level) =>
            sum +
            level.spaces.reduce((levelSum, space) => levelSum + space.area, 0),
        0,
    );

    const totalSpaces = levelData.reduce(
        (sum, level) =>
            sum +
            level.spaces.reduce(
                (levelSum, space) => levelSum + space.amount,
                0,
            ),
        0,
    );

    return (
        <div className="container mx-auto min-h-screen p-6">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-base font-light">
                        Resumen de Niveles y Ambientes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col items-center justify-center rounded-lg p-4">
                            <Maximize2 className="mb-2 h-6 w-6" />
                            <span className="text-lg font-light">
                                {totalArea} m²
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Área Total
                            </span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg p-4">
                            <Home className="mb-2 h-6 w-6" />
                            <span className="text-lg font-light">
                                {totalSpaces}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Espacios Totales
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center text-base font-light">
                            <Layers
                                className="mr-4 h-6 w-6"
                                strokeWidth={1.5}
                            />
                            Niveles del Edificio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs
                            orientation="vertical"
                            value={activeLevel}
                            onValueChange={setActiveLevel}
                            className="w-full"
                        >
                            <TabsList className="flex h-auto w-full flex-col items-stretch">
                                {levelData.map((level) => (
                                    <TabsTrigger
                                        key={level.name}
                                        value={level.name}
                                        className="justify-start font-light"
                                    >
                                        {level.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-base font-light">
                            Espacios del Nivel
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px] w-full pr-4">
                            <>
                                {levelData.map(
                                    (level) =>
                                        activeLevel === level.name && (
                                            <div
                                                key={level.name}
                                                className="grid grid-cols-1 gap-4 lg:grid-cols-2"
                                            >
                                                {level.spaces.map(
                                                    (space, index) => (
                                                        <SpaceCardQuotationDescription
                                                            key={space.name}
                                                            space={space}
                                                            level={level.name}
                                                            index={index}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ),
                                )}
                            </>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
