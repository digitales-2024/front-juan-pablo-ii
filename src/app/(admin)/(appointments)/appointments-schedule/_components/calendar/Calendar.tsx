"use client";
import CalendarBody from "./body/CalendarBody";
import CalendarHeaderActions from "./header/actions/CalendarHeaderActions";
import CalendarHeaderActionsMode from "./header/actions/CalendarHeaderActionsMode";
import CalendarHeader from "./header/CalendarHeader";
import CalendarHeaderDate from "./header/date/CalendarHeaderDate";

export default function Calendar() {
	return (
		<>
			<CalendarHeader>
				<CalendarHeaderDate />
				<CalendarHeaderActions>
					<CalendarHeaderActionsMode />
				</CalendarHeaderActions>
			</CalendarHeader>
			<CalendarBody />
		</>
	);
}
