export type CalendarProps = {
	events: CalendarEvent[];
	setEvents: (events: CalendarEvent[]) => void;
	mode: Mode;
	setMode: (mode: Mode) => void;
	date: Date;
	setDate: (date: Date) => void;
	calendarIconIsToday?: boolean;
};

export type CalendarContextType = CalendarProps & {
	newEventDialogOpen: boolean;
	setNewEventDialogOpen: (open: boolean) => void;
	manageEventDialogOpen: boolean;
	setManageEventDialogOpen: (open: boolean) => void;
	selectedEvent: CalendarEvent | null;
	setSelectedEvent: (event: CalendarEvent | null) => void;
};

export type ColorType = "blue" | "indigo" | "pink" | "red" | "orange" | "amber" | "emerald" | "sky";

export interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	color?: string;
	staff: {
		name: string;
		lastName: string;
	  };
	  branch: {
		name: string;
	  };
	type: "TURNO" | "CITA" | "OTRO";
	status: "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
	isActive: boolean;
	isCancelled: boolean;
	isBaseEvent: boolean;
	branchId: string;
	staffId: string;
	staffScheduleId: string;
	recurrence: {
		frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
		interval: number;
		until: string;
	};
	exceptionDates?: Date[];
	cancellationReason?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export const calendarModes = ["dia", "semana", "mes"] as const;
export type Mode = (typeof calendarModes)[number];
