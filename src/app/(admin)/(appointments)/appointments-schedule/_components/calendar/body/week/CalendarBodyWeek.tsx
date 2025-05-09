import { startOfWeek, addDays, isSameDay } from "date-fns";
import { useCalendarContext } from "../../CalendarContext";
import CalendarBodyMarginDayMargin from "../day/CalendarBodyMarginDayMargin";
import CalendarBodyDayContent from "../day/CalendarBodyDayContent";

export default function CalendarBodyWeek() {
	const { events, date } = useCalendarContext();

	const weekStart = startOfWeek(date, { weekStartsOn: 1 });
	const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

	return (
		<div className="flex flex-col flex-grow overflow-hidden">
			<div className="flex flex-1 overflow-auto">
				<CalendarBodyMarginDayMargin className="hidden md:block" />

				<div className="flex flex-1 divide-x flex-col md:flex-row">
					{weekDays.map((day) => (
						<div
							key={day.toISOString()}
							className="relative flex-1 flex flex-col"
						>
							<div className="block md:hidden border-b">
								<CalendarBodyMarginDayMargin />
								<CalendarBodyDayContent date={day} />
							</div>

							<div className="hidden md:block h-full">
								<CalendarBodyDayContent date={day} />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
