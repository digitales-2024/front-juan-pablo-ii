"use client";
import { useState, useEffect } from "react";
import { CalendarEvent, Mode } from "../_types/CalendarTypes";
import Calendar from "./calendar/Calendar";
import { generateMockEvents } from "../_libs/mock-calendar-events";

// Define el tipo de datos que entrega la API
// interface ApiCalendarEvent {
// 	id: string;
// 	title: string;
// 	type: "TURNO" | string;
// 	start: string;
// 	end: string;
// 	color?: string;
// 	status: string;
// 	isActive: boolean;
// 	isCancelled: boolean;
// 	isBaseEvent: boolean;
// 	branchId: string;
// 	staffId: string;
// 	staffScheduleId: string;
// 	recurrence?: string | null;
// 	exceptionDates?: any[];
// 	cancellationReason?: string | null;
// 	createdAt: string;
// 	updatedAt: string;
// }

export default function CalendarConsultations() {
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [mode, setMode] = useState<Mode>("mes");
	const [date, setDate] = useState<Date>(new Date("2024-01-01"));

	useEffect(() => {
		// Cargar datos mock temporalmente
		console.log("[DEBUG] Cargando eventos mock...");
		
		const mockData = generateMockEvents();
		console.log("[DEBUG] Eventos mock cargados:", mockData);
		
		setEvents(mockData);
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
