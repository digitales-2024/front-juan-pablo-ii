"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function ErrorProductTypes({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Opcional: Log del error en un servicio de monitoreo
		console.error(error);
	}, [error]);

	return (
		<Card className="p-6">
			<div className="flex flex-col items-center justify-center text-center">
				<AlertTriangle className="h-10 w-10 text-destructive" />
				<h2 className="mt-4 text-lg font-semibold">
					Error al cargar los Tipos de Productos
				</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					{error.message || 'Ha ocurrido un error inesperado'}
				</p>
				<Button
					onClick={reset}
					variant="outline"
					className="mt-4"
				>
					<RefreshCcw className="mr-2 h-4 w-4" />
					Intentar nuevamente
				</Button>
			</div>
		</Card>
	);
}
