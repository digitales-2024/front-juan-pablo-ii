import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";

interface LeftPanelProps {
	date: Date;
	time: string;
}
export default function LeftPanel({ date, time }: LeftPanelProps) {
	return (
		<div className="flex gap-4">
			<div className="gap-2 h-fit">
				<p className="text-gray-12 text-2xl font-bold">
					Crear una consulta
				</p>
				<div className="flex text-gray-12">
					<Calendar className="size-4 mr-2" />
					<div className="flex flex-col text-sm font-semibold">
						<p>
							{format(date, "PPP", { locale: es })} a las {time}
						</p>
					</div>
				</div>
			</div>
			<Separator
				orientation="vertical"
				className="h-auto sm:visible invisible"
			/>
		</div>
	);
}
