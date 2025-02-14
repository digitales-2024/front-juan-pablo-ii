import React from "react";
import { AlertTriangle } from "lucide-react";

export default function NotFoundSearchResults() {
    return (
        <div className="flex h-fit shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <AlertTriangle className="h-10 w-10 text-red-500" />
                <h3 className="mt-4 text-lg font-semibold">No se encontraron resultados</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Intenta ajustar tu búsqueda o utiliza diferentes términos.
                </p>
            </div>
        </div>
    );
}