"use client";
import { createContext, useContext } from "react";
import { CalendarContextType } from "../../_types/CalendarTypes";
import { EventFilterParams } from "../../_hooks/useEvents";
import { UseQueryResult } from "@tanstack/react-query";
import { Event } from "../../_interfaces/event.interface";

export const CalendarContext = createContext<CalendarContextType>({
	events: [],
	// Inicializar todas las propiedades requeridas
	currentMonth: 0,
	setEvents: () => { },
	mode: 'mes',
	setMode: () => { },
	date: new Date(),
	setDate: () => { },
	calendarIconIsToday: true,
	newEventDialogOpen: false,
	setNewEventDialogOpen: () => { },
	manageEventDialogOpen: false,
	setManageEventDialogOpen: () => { },
	selectedEvent: null,
	setSelectedEvent: () => { },
	filters: {} as EventFilterParams,
	eventsQuery: {} as UseQueryResult<Event[], Error>,
});

export function useCalendarContext() {
	const context = useContext(CalendarContext);
	if (!context) {
		throw new Error(
			"useCalendarContext must be used within a CalendarProvider"
		);
	}
	return context;
}
