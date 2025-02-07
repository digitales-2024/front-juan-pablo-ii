"use client";
import { useState, useEffect } from "react";
import { CalendarEvent, Mode } from "../../_types/CalendarTypes";
import { CalendarContext } from "./CalendarContext";
import CalendarNewEventDialog from "./dialog/CalendarNewEventDialog";
import CalendarManageEventDialog from "./dialog/CalendarManageEventDialog";

export default function CalendarProvider({
	events,
	setEvents,
	mode,
	setMode,
	date,
	setDate,
	calendarIconIsToday = true,
	children,
}: {
	events: CalendarEvent[];
	setEvents: (events: CalendarEvent[]) => void;
	mode: Mode;
	setMode: (mode: Mode) => void;
	date: Date;
	setDate: (date: Date) => void;
	calendarIconIsToday: boolean;
	children: React.ReactNode;
}) {
	const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
	const [manageEventDialogOpen, setManageEventDialogOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null
	);

	useEffect(() => {
		console.log("[DEBUG] Eventos en el Provider:", events);
	}, [events]);

	return (
		<CalendarContext.Provider
			value={{
				events,
				setEvents,
				mode,
				setMode,
				date,
				setDate,
				calendarIconIsToday,
				newEventDialogOpen,
				setNewEventDialogOpen,
				manageEventDialogOpen,
				setManageEventDialogOpen,
				selectedEvent,
				setSelectedEvent,
			}}
		>
			<CalendarNewEventDialog />
			<CalendarManageEventDialog />
			{children}
		</CalendarContext.Provider>
	);
}
