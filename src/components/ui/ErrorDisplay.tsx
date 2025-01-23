import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface ErrorDisplayProps {
	error?: Error;
	title?: string;
	message?: string;
	retry?: () => void;
	className?: string;
}

export function ErrorDisplay({
	error,
	title = "Ha ocurrido un error",
	message = "Lo sentimos, algo salió mal. Por favor intenta de nuevo.",
	retry,
	className,
}: ErrorDisplayProps) {
	const router = useRouter();

	return (
		<div
			className={`flex flex-col items-center justify-center min-h-[400px] p-8 text-center ${className}`}
		>
			<div className="text-destructive mb-6">
				<AlertCircle className="w-16 h-16 mx-auto animate-pulse" />
			</div>

			<h2 className="text-2xl font-bold mb-4">{title}</h2>

			<p className="text-muted-foreground mb-8 max-w-md">
				{message}
				{error && (
					<span className="block mt-2 text-sm text-destructive/80">
						{error.message}
					</span>
				)}
			</p>

			<div className="flex gap-4">
				{retry && (
					<Button
						variant="outline"
						onClick={retry}
						className="flex items-center gap-2"
					>
						<RefreshCw className="w-4 h-4" />
						Intentar de nuevo
					</Button>
				)}

				<Button
					variant="default"
					onClick={() => router.push("/")}
					className="flex items-center gap-2"
				>
					<Home className="w-4 h-4" />
					Ir al inicio
				</Button>
			</div>
		</div>
	);
}
