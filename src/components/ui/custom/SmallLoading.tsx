import { Loader2 } from "lucide-react";
import React from "react";

export default function SmallLoading() {
    return (
        <div className="flex h-fit shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <h3 className="mt-4 text-lg font-semibold">Cargando...</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Por favor espera
                </p>
            </div>
        </div>
    );
}