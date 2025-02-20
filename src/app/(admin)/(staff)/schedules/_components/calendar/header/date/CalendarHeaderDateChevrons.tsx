import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	format,
	addDays,
	addMonths,
	addWeeks,
	subDays,
	subMonths,
	subWeeks,
} from "date-fns";
import { useCalendarContext } from "../../CalendarContext";
import { es } from "date-fns/locale";

export default function CalendarHeaderDateChevrons() {
	const { mode, date, setDate } = useCalendarContext();

	function handleDateBackward() {
		switch (mode) {
			case "mes":
				setDate(subMonths(date, 1));
				break;
			case "semana":
				setDate(subWeeks(date, 1));
				break;
			case "dia":
				setDate(subDays(date, 1));
				break;
		}
	}

	function handleDateForward() {
		switch (mode) {
			case "mes":
				setDate(addMonths(date, 1));
				break;
			case "semana":
				setDate(addWeeks(date, 1));
				break;
			case "dia":
				setDate(addDays(date, 1));
				break;
		}
	}

	return (
		<div className="flex items-center gap-2">
			<Button
				variant="outline"
				className="h-7 w-7 p-1"
				onClick={handleDateBackward}
			>
				<ChevronLeft className="min-w-5 min-h-5" />
			</Button>

			<span className="min-w-[140px] text-center font-medium">
				{format(date, "MMMM d, yyyy", { locale: es })}
			</span>

			<Button
				variant="outline"
				className="h-7 w-7 p-1"
				onClick={handleDateForward}
			>
				<ChevronRight className="min-w-5 min-h-5" />
			</Button>
		</div>
	);
}
