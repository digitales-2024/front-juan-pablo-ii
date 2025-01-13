"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function NotFound() {
	const navigate = useRouter();
	const history = typeof window !== "undefined" ? window.history : null;
	return (
		<div className="h-svh">
			<div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
				<h1 className="text-[7rem] font-bold leading-tight">404</h1>
				<span className="font-medium">¡Ups!¡Página no encontrada!</span>
				<p className="text-center text-muted-foreground">
					Parece que la página que estás buscando <br />
					no existe o podría haber sido eliminado.
				</p>
				<div className="mt-6 flex gap-4">
					<Button variant="outline" onClick={() => history?.go(-1)}>
						Volver
					</Button>
					<Button onClick={() => navigate.push("/")}>
						Volver a inicio
					</Button>
				</div>
			</div>
		</div>
	);
}
