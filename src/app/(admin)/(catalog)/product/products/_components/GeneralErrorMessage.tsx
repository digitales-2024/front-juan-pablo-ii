import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react'
import React from 'react'


export default function GeneralErrorMessage({
    error,
    reset,
  }: {
    error: Error;
    reset: () => void;
  }) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold">Algo salió mal</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            {error.message || "Ocurrió un error al cargar las sucursales"}
          </p>
          <Button size="sm" onClick={reset}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
  )
}
