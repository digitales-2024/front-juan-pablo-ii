"use client";

import { Client } from "@/types";
import { MapPin, Building, Phone } from "lucide-react";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

interface ClientDescriptionProps {
    row: Client;
}

export const ClientDescription = ({ row }: ClientDescriptionProps) => {
    return (
        <Card className="m-8 p-4 shadow-lg">
            <CardHeader className="flex flex-col items-center sm:flex-row sm:items-start">
                <Avatar className="h-20 w-20 border-2 border-primary capitalize">
                    <AvatarFallback>
                        <span className="text-3xl">{row.name.charAt(0)}</span>
                    </AvatarFallback>
                </Avatar>
                <div className="mt-4 sm:ml-6 sm:mt-0">
                    <CardTitle className="text-2xl font-semibold capitalize">
                        {row.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                        {row.rucDni}
                    </CardDescription>
                    <Badge
                        variant="secondary"
                        className={`mt-2 ${
                            row.isActive
                                ? "bg-emerald-100 text-emerald-500"
                                : "bg-red-100 text-red-500"
                        }`}
                    >
                        {row.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                </div>
            </CardHeader>
            <Separator className="my-4" />
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                        <MapPin size={20} className="mr-2 text-gray-400" />
                        <span className="font-medium">Dirección:</span>
                        <span className="ml-2">{row.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Building size={20} className="mr-2 text-gray-400" />
                        <span className="font-medium">Ubicación:</span>
                        <span className="ml-2 capitalize">
                            {row.province}, {row.department}
                        </span>
                    </div>
                    {row.phone ? (
                        <div className="flex items-center text-gray-600">
                            <Phone size={20} className="mr-2 text-gray-400" />
                            <span className="font-medium">Teléfono:</span>
                            <span className="ml-2">{row.phone}</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-gray-600">
                            <Phone size={20} className="mr-2 text-gray-400" />
                            <span className="font-medium">Teléfono:</span>
                            <span className="ml-2">
                                No se registró teléfono
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
