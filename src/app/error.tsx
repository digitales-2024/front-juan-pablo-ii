"use client";

import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
	const getErrorMessage = () => {
		if (error.message.includes("fetch")) {
			return "No pudimos conectarnos al servidor. Por favor, verifica tu conexión a internet.";
		}
		if (error.message.includes("unauthorized")) {
			return "No tienes permisos para acceder a esta sección.";
		}
		return "Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.";
	};

	return (
		<html>
			<body>
				<ErrorDisplay
					error={error}
					message={getErrorMessage()}
					retry={reset}
					className="bg-background/60 backdrop-blur-sm rounded-lg"
				/>
			</body>
		</html>
	);
}
