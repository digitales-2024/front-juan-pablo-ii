"use client";
import { socket } from "@/socket/socket";
import { Circle } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export const ApiStatus = () => {
    const autoCloseDelay = 3000; // 3 segundos para que se oculte el círculo
    const [isConnected, setIsConnected] = useState<boolean>(false); // Estado de la conexión
    const [isVisible, setIsVisible] = useState<boolean>(false); // Controla la visibilidad del círculo

    useEffect(() => {
        // Función para manejar la conexión
        const handleConnect = () => {
            setIsConnected(true);
            setIsVisible(true); // Mostrar el círculo al conectarse
        };

        // Función para manejar la desconexión
        const handleDisconnect = () => {
            setIsConnected(false);
            setIsVisible(true); // Mostrar el círculo al desconectarse
        };

        // Escuchar eventos del socket
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        // Limpiar listeners cuando el componente se desmonte
        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
        };
    }, []);

    // Ocultar el círculo después de 3 segundos cuando haya un cambio en `isVisible`
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false); // Ocultar el círculo después de 3 segundos
            }, autoCloseDelay);

            // Limpiar el temporizador si el componente se desmonta antes de que el timer termine
            return () => clearTimeout(timer);
        }
    }, [isVisible, autoCloseDelay]); // El efecto se ejecuta cada vez que `isVisible` cambia

    // Si `isVisible` es false, no se muestra nada
    if (!isVisible) return null;

    // Render del círculo (verde para conectado, rojo para desconectado)
    return (
        <Circle
            className={cn("absolute right-2 top-2 z-50 size-2 stroke-none", {
                "fill-green-500": isConnected, // Verde si está conectado
                "fill-red-500": !isConnected, // Rojo si está desconectado
            })}
        />
    );
};
