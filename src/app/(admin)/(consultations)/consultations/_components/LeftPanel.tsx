import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";

interface LeftPanelProps {
	showForm: boolean;
	date: Date;
	time: string;
}
export default function LeftPanel({ showForm, date, time }: LeftPanelProps) {
	return (
		<div className="grid gap-2 h-fit ">
			<p className="text-gray-12 text-2xl font-bold">
				Crear una consulta
			</p>
			{!showForm && (
				<div className="flex text-gray-12">
					<Calendar className="size-4 mr-2" />
					<div className="flex flex-col text-sm font-semibold">
						<p>
							{format(date, "PPP", { locale: es })} a las {time}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
