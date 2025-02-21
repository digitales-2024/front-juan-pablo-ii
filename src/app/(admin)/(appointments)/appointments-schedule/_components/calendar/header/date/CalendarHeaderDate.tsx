import { format } from "date-fns";
import { useCalendarContext } from "../../CalendarContext";
import CalendarHeaderDateIcon from "./CalendarHeaderDateIcon";
import CalendarHeaderDateBadge from "./CalendarHeaderDateBadge";
import CalendarHeaderDateChevrons from "./CalendarHeaderDateChevrons";
import { es } from "date-fns/locale";

export default function CalendarHeaderDate() {
	const { date } = useCalendarContext();
	return (
		<div className="flex items-center gap-2">
			<CalendarHeaderDateIcon />
			<div>
				<div className="flex items-center gap-1">
					<p className="text-lg font-semibold capitalize">
						{format(date, "MMMM yyyy", { locale: es })}
					</p>
					<CalendarHeaderDateBadge />
				</div>
				<CalendarHeaderDateChevrons />
			</div>
		</div>
	);
}
