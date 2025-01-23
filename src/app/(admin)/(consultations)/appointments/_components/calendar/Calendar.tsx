"use client";
import { CalendarProps } from "../../_types/CalendarTypes";
import CalendarBody from "./body/CalendarBody";
import CalendarProvider from "./CalendarProvider";
import CalendarHeaderActions from "./header/actions/CalendarHeaderActions";
import CalendarHeaderActionsAdd from "./header/actions/CalendarHeaderActionsAdd";
import CalendarHeaderActionsMode from "./header/actions/CalendarHeaderActionsMode";
import CalendarHeader from "./header/CalendarHeader";
import CalendarHeaderDate from "./header/date/CalendarHeaderDate";

export default function Calendar({
	events,
	setEvents,
	mode,
	setMode,
	date,
	setDate,
	calendarIconIsToday = true,
}: CalendarProps) {
	return (
		<CalendarProvider
			events={events}
			setEvents={setEvents}
			mode={mode}
			setMode={setMode}
			date={date}
			setDate={setDate}
			calendarIconIsToday={calendarIconIsToday}
		>
			<CalendarHeader>
				<CalendarHeaderDate />
				<CalendarHeaderActions>
					<CalendarHeaderActionsMode />
					<CalendarHeaderActionsAdd />
				</CalendarHeaderActions>
			</CalendarHeader>
			<CalendarBody />
		</CalendarProvider>
	);
}
