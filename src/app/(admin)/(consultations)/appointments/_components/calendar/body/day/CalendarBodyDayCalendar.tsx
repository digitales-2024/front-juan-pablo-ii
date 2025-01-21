import { Calendar } from "@/components/ui/calendar";
import { useCalendarContext } from "../../CalendarContext";

export default function CalendarBodyDayCalendar() {
	const { date, setDate } = useCalendarContext();
	return (
		<Calendar
			selected={date}
			onSelect={(date: Date | undefined) => date && setDate(date)}
			mode="single"
		/>
	);
}
