import { useCalendarContext } from "../CalendarContext";
import CalendarBodyDay from "./day/CalendarBodyDay";
import CalendarBodyMonth from "./month/CalendarBodyMonth";
import CalendarBodyWeek from "./week/CalendarBodyWeek";

export default function CalendarBody() {
	const { mode } = useCalendarContext();

	return (
		<>
			{mode === "dia" && <CalendarBodyDay />}
			{mode === "semana" && <CalendarBodyWeek />}
			{mode === "mes" && <CalendarBodyMonth />}
		</>
	);
}
