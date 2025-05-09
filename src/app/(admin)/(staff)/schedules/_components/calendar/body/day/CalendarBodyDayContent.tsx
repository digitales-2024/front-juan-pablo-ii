import { isSameDay } from "date-fns";
import { useCalendarContext } from "../../CalendarContext";
import CalendarBodyHeader from "../CalendarBodyHeader";
import { hours } from "./CalendarBodyMarginDayMargin";
import CalendarEvent from "../../CalendarEvent";

export default function CalendarBodyDayContent({ date }: { date: Date }) {
	const { events } = useCalendarContext();
	console.log("[DEBUG] Eventos en el día:", date.toISOString(), events.filter((event) => isSameDay(event.start, date)));

	const dayEvents = events.filter((event) => isSameDay(event.start, date));

	return (
		<div className="flex flex-col flex-grow">
			<CalendarBodyHeader date={date} />

			<div className="flex-1 relative">
				{hours.map((hour) => (
					<div
						key={hour}
						className="h-32 border-b border-border/50 group"
					/>
				))}

				{dayEvents.map((event) => (
					<CalendarEvent key={event.id} event={event} />
				))}
			</div>
		</div>
	);
}
