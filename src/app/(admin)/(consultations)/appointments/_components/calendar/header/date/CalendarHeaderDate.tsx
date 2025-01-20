import { format } from "date-fns";
import { useCalendarContext } from "../../CalendarContext";
import CalendarHeaderDateIcon from "./CalendarHeaderDateIcon";
import CalendarHeaderDateBadge from "./CalendarHeaderDateBadge";
import CalendarHeaderDateChevrons from "./CalendarHeaderDateChevrons";

export default function CalendarHeaderDate() {
	const { date } = useCalendarContext();
	return (
		<div className="flex items-center gap-2">
			<CalendarHeaderDateIcon />
			<div>
				<div className="flex items-center gap-1">
					<p className="text-lg font-semibold">
						{format(date, "MMMM yyyy")}
					</p>
					<CalendarHeaderDateBadge />
				</div>
				<CalendarHeaderDateChevrons />
			</div>
		</div>
	);
}
