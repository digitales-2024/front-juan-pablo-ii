import { LogoJP } from "@/assets/images/LogoJP";
import LayoutAdmin from "./(admin)/layout";

export default function Home() {
	return (
		<LayoutAdmin>
			<div className="flex flex-col items-center justify-start min-h-screen gap-6">
				<LogoJP className="w-48 h-48" />
				<div className="text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-gray-500 bg-clip-text text-transparent">
						Bienvenido
					</h1>
					<h2 className="text-3xl text-gray-500 mt-2">
						Juan Pablo II
					</h2>
				</div>
			</div>
		</LayoutAdmin>
	);
}
