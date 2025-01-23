"use client";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type Action = {
    actionType: string;
    contractId?: string;
    documentId?: string;
    timestamp: string;
};

type UserSession = {
    userId: string;
    userName: string;
    sessionStart: string;
    sessionEnd: string;
    actions: Action[];
};

const testData: UserSession[] = [
    {
        userId: "12345",
        userName: "John Doe",
        sessionStart: "2023-10-26T10:00:00.000-05:00",
        sessionEnd: "2023-10-26T12:00:00.000-05:00",
        actions: [
            {
                actionType: "Inicio sesión en el sistema",
                contractId: "1234",
                timestamp: "2023-10-26T10:05:00.000-05:00",
            },
            {
                actionType: "Registró un contrato",
                contractId: "1234",
                timestamp: "2023-10-26T10:15:00.000-05:00",
            },
            {
                actionType: "Descargó reporte de un contrato",
                contractId: "1234",
                timestamp: "2023-10-26T11:30:00.000-05:00",
            },
            {
                actionType: "Visaulizó los detalles del contrato 123",
                documentId: "5678",
                timestamp: "2023-10-26T11:45:00.000-05:00",
            },
        ],
    },
    {
        userId: "67890",
        userName: "Jane Smith",
        sessionStart: "2023-10-26T14:00:00.000-05:00",
        sessionEnd: "2023-10-26T16:00:00.000-05:00",
        actions: [
            {
                actionType: "createContract",
                contractId: "5678",
                timestamp: "2023-10-26T14:10:00.000-05:00",
            },
            {
                actionType: "uploadDocument",
                documentId: "9101",
                timestamp: "2023-10-26T15:20:00.000-05:00",
            },
        ],
    },
];

export default function UserActivityLogger() {
    const [sessions] = useState<UserSession[]>(testData);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString("es-ES", {
            timeZone: "America/Bogota",
        });

    return (
        <div>
            <div className="pb-8 pt-16">
                <h2 className="pb-2 text-4xl font-black">Registros</h2>
                <p className="text-sm text-muted-foreground">
                    Registro de las acciones realizadas en la aplicación
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registro de Actividad de los usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="max-h-96 overflow-y-auto rounded-md border p-4">
                            <h3 className="mb-2 font-semibold">
                                Sesiones de Usuario:
                            </h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Usuario</TableHead>
                                        <TableHead>Inicio de Sesión</TableHead>
                                        <TableHead>Fin de Sesión</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sessions.map((session, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {session.userName}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(
                                                    session.sessionStart,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {session.sessionEnd
                                                    ? formatDate(
                                                          session.sessionEnd,
                                                      )
                                                    : "Activa"}
                                            </TableCell>
                                            <TableCell>
                                                {session.actions.map(
                                                    (action, actionIndex) => (
                                                        <div
                                                            key={actionIndex}
                                                            className="mb-2"
                                                        >
                                                            <div className="font-semibold">
                                                                {formatDate(
                                                                    action.timestamp,
                                                                )}
                                                            </div>
                                                            <div>
                                                                {
                                                                    action.actionType
                                                                }
                                                            </div>
                                                            {action.contractId && (
                                                                <div>
                                                                    Contrato:{" "}
                                                                    {
                                                                        action.contractId
                                                                    }
                                                                </div>
                                                            )}
                                                            {action.documentId && (
                                                                <div>
                                                                    Documento:{" "}
                                                                    {
                                                                        action.documentId
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
