import { Columns2, Grid3X3, List } from "lucide-react";
import { Mode } from "../../_types/CalendarTypes";

export const calendarModeIconMap: Record<Mode, React.ReactNode> = {
	dia: <List />,
	semana: <Columns2 />,
	mes: <Grid3X3 />,
};
