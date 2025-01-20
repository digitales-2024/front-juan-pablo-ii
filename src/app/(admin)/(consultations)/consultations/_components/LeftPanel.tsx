import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";

interface LeftPanelProps {
	showForm: boolean;
	date: Date;
}
export default function LeftPanel({ showForm, date }: LeftPanelProps) {
	return (
		<div className="grid gap-3">
			<p className="text-gray-12 text-2xl font-bold">Demo</p>
			{showForm && (
				<div className="flex text-gray-12">
					<Calendar className="size-4 mr-2" />
					<div className="flex flex-col text-sm font-semibold">
						<p>{format(date, "PPPp", { locale: es })}</p>
					</div>
				</div>
			)}
		</div>
	);
}
