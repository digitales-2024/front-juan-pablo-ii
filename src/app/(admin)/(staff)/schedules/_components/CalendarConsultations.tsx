"use client";
import { useState, useEffect } from "react";
import { Mode } from "../_types/CalendarTypes";
import Calendar from "./calendar/Calendar";
import { useEvents, type EventFilterParams } from "../_hooks/useEvents";

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

// Definir tipo explícito para los filtros
const filters: EventFilterParams = {
	staffId: "e474ce76-090e-4e21-9355-6fa867da716a",
	type: "TURNO",
	branchId: "d7b0f2a1-809f-419d-9f66-98b7ed8812fb",
	status: "CONFIRMED",
};

export default function CalendarConsultations() {
	const [mode, setMode] = useState<Mode>("mes");
	const [date, setDate] = useState<Date>(new Date("2025-01-01"));
	
	const { eventsQuery: { data: events, isLoading, error } } = useEvents(filters);

	useEffect(() => {
		console.log("🔄 Estado de carga de eventos:", {
			isLoading,
			error: error?.message,
			eventsCount: events?.length
		});
	}, [isLoading, error, events]);

	useEffect(() => {
		if (error) {
			console.error("🚨 Error cargando eventos:", error);
		}
	}, [error]);

	return (
		<div>
			{isLoading && <div>Cargando eventos...</div>}
			{error && <div>Error al cargar eventos: {error.message}</div>}
			<Calendar
				events={events || []}
				setEvents={() => {}}
				mode={mode}
				setMode={setMode}
				date={date}
				setDate={setDate}
			/>
		</div>
	);
}
