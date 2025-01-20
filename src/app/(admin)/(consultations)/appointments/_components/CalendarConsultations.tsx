"use client";
import { useState, useEffect } from "react";
import { generateMockEvents } from "../_libs/mock-calendar-events";
import { CalendarEvent, Mode } from "../_types/CalendarTypes";
import Calendar from "./calendar/Calendar";

export default function CalendarConsultations() {
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [mode, setMode] = useState<Mode>("month");
	const [date, setDate] = useState<Date>(new Date('2024-01-01'));

	useEffect(() => {
		setEvents(generateMockEvents());
		setDate(new Date());
	}, []);

	return (
		<div>
			<Calendar
				events={events}
				setEvents={setEvents}
				mode={mode}
				setMode={setMode}
				date={date}
				setDate={setDate}
			/>
		</div>
	);
}
