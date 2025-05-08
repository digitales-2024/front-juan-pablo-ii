import { Calendar1, CalendarDays, CalendarFold } from "lucide-react";
import { Mode } from "../../_types/CalendarTypes";

export const calendarModeIconMap: Record<Mode, React.ReactNode> = {
	dia: <Calendar1 />,
	semana: <CalendarFold />,
	mes: <CalendarDays />,
};
