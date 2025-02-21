import { Columns2, Grid3X3, List } from "lucide-react";
import { Mode } from "@/app/(admin)/(staff)/schedules/_types/CalendarTypes";

export const calendarModeIconMap: Record<Mode, React.ReactNode> = {
	dia: <List />,
	semana: <Columns2 />,
	mes: <Grid3X3 />,
};
