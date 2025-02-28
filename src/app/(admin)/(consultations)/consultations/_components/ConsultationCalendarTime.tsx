import { UseFormReturn } from "react-hook-form";
import { ConsultationSchema } from "../type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CalendarBig } from "./calendar/CalendarBig";
import { format, isBefore, isToday, startOfDay, startOfToday, startOfMonth, endOfMonth, subDays, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";
import { useEvents } from "@/app/(admin)/(staff)/schedules/_hooks/useEvents";
import { useEffect, useState } from 'react';
import { availableTimes } from "./available-times";

interface ConsultationCalendarTimeProps {
	form: UseFormReturn<ConsultationSchema>;
	allowPastDates: boolean;
	showAvailableDays: boolean;
	showAvailableHours: boolean;
	selectedStaffId: string;
	selectedBranchId: string;
	onMonthChange?: (date: Date) => void;
	selectedDate: Date;
}

export default function ConsultationCalendarTime({
	form,
	allowPastDates,
	showAvailableDays,
	showAvailableHours,
	selectedStaffId,
	selectedBranchId,
	onMonthChange,
	selectedDate: initialSelectedDate,
}: ConsultationCalendarTimeProps) {
	const selectedTime = form.watch("time") as string;
	const now = new Date();
	const [selectedDate, setSelectedDate] = useState(initialSelectedDate);

	console.log("onMonthChange:", onMonthChange);

	console.log("ID de personal recibido:", selectedStaffId);
	console.log("ID de sucursal recibido:", selectedBranchId);

	// Calcular startDate y endDate directamente
	const monthStart = startOfMonth(selectedDate);
	const monthEnd = endOfMonth(selectedDate);
	const startDate = subDays(monthStart, 7);
	const endDate = addDays(monthEnd, 7);

	console.log("startDate:", startDate);
	console.log("endDate:", endDate);


	// Actualizar safeFilters con las nuevas fechas
	const updatedSafeFilters = {
		type: 'TURNO' as const,
		staffId: selectedStaffId,
		branchId: selectedBranchId,
		status: 'CONFIRMED' as const,
		startDate: format(startDate, 'yyyy-MM-dd'),
		endDate: format(endDate, 'yyyy-MM-dd'),
	};

	// Fetch events based on filters
	const { events, eventsQuery } = useEvents(updatedSafeFilters);

	// Parse available days from events
	const availableDays = (events || []).map(event => new Date(event.start));

	// Filtrar horas disponibles para el día seleccionado
	const availableHoursForSelectedDate = (events || []).filter(event => {
		const eventStart = new Date(event.start);
		return isSameDay(eventStart, selectedDate);
	}).map(event => {
		const start = new Date(event.start).toLocaleString("en-US", { timeZone: "America/Lima" });
		const end = new Date(event.end).toLocaleString("en-US", { timeZone: "America/Lima" });
		const startDate = new Date(start);
		const endDate = new Date(end);

		// Crear un array de intervalos de 30 minutos
		const timeSlots = [];
		for (let d = startDate; d < endDate; d.setMinutes(d.getMinutes() + 30)) {
			timeSlots.push(new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
		}

		return {
			timeSlots,
			id: event.id,
		};
	});

	console.log("horarios de showAvailableHours ", JSON.stringify(availableHoursForSelectedDate, null, 2));

	// Crear un array de horarios en formato de 12 horas
	const timeSlots = [
		"09:00am", "09:30am", "10:00am", "10:30am", "11:00am", "11:30am", "12:00pm", "12:30pm",
		"01:00pm", "01:30pm", "02:00pm", "02:30pm", "03:00pm", "03:30pm", "04:00pm", "04:30pm",
		"05:00pm", "05:30pm", "06:00pm", "06:30pm", "07:00pm", "07:30pm", "08:00pm", "08:30pm"
	];

	console.log("horarios switch", showAvailableHours);

	// Filtrar los horarios disponibles en base a los eventos
	const filteredTimeSlots = showAvailableHours
		? availableHoursForSelectedDate.flatMap(event => event.timeSlots).filter(timeStr => {
			const [timePart, modifier] = timeStr.split(" ");
			let [hoursStr, minutesStr] = timePart.split(":");
			let hours = Number(hoursStr);
			let minutes = Number(minutesStr);

			// Validar si minutes es NaN y asignar 0 si es el caso
			if (isNaN(minutes)) {
				minutes = 0;
			}

			const baseDate = new Date(selectedDate); // Fecha base

			// Convertir a 24 horas
			if (modifier === "pm" && hours < 12) {
				hours += 12;
			} else if (modifier === "am" && hours === 12) {
				hours = 0;
			}

			// Clonar la fecha base y establecer la hora
			const comparisonDate = new Date(baseDate);
			comparisonDate.setHours(hours, minutes, 0, 0); // Establecer horas, minutos, segundos y milisegundos

			return availableHoursForSelectedDate.some((event: { timeSlots: string[] }) => {
				return event.timeSlots.includes(timeStr);
			});
		})
		: timeSlots;

	console.log("horarios de filteredTimeSlots", filteredTimeSlots);


	console.log("Días disponibles:", availableDays);



	useEffect(() => {
		console.log("selectedDate actualizado:", selectedDate);
		const monthStart = startOfMonth(selectedDate);
		const monthEnd = endOfMonth(selectedDate);
		const startDate = subDays(monthStart, 7);
		const endDate = addDays(monthEnd, 7);

		console.log("startDate:", format(startDate, 'yyyy-MM-dd'));
		console.log("endDate:", format(endDate, 'yyyy-MM-dd'));

		const updatedSafeFilters = {
			type: 'TURNO' as const,
			staffId: selectedStaffId,
			branchId: selectedBranchId,
			status: 'CONFIRMED' as const,
			startDate: format(startDate, 'yyyy-MM-dd'),
			endDate: format(endDate, 'yyyy-MM-dd'),
		};

		console.log("Filtros seguros actualizados:", updatedSafeFilters);
		// Log de la consulta actualizada
		console.log("Consulta actualizada:", eventsQuery);

		// Refetch events when selectedDate changes
		if (eventsQuery && eventsQuery.refetch) {
			console.log("Refetching events with new filters");
			eventsQuery.refetch();
		}
	}, [selectedDate, selectedStaffId, selectedBranchId, eventsQuery]);

	const isDateDisabled = (date: Date) => {
		if (allowPastDates) return false;
		return isBefore(startOfDay(date), startOfToday());
	};

	const isTimeDisabled = (timeStr: string) => {
		if (!isToday(selectedDate) || allowPastDates) return false;
		const [hours, minutes] = timeStr.split(":").map(Number);
		const selectedDateTime = new Date(selectedDate);
		selectedDateTime.setHours(hours, minutes);
		return isBefore(selectedDateTime, now);
	};

	return (
		<div className="w-auto space-x-10 flex-wrap flex items-start h-fit">
			<div className="space-y-4">
				<h3 className="font-semibold">Fecha de consulta</h3>
				<CalendarBig
					locale={es}
					selected={selectedDate}
					mode="single"
					disabled={isDateDisabled}
					defaultMonth={selectedDate}
					showAvailableDays={showAvailableDays}
					availableDays={availableDays}
					onSelect={(date: Date | undefined) => {
						if (date) {
							form.setValue("date", date, {
								shouldValidate: true,
								shouldDirty: true,
								shouldTouch: true,
							});
							// Reset time if it's disabled for the new date
							const currentTime = form.getValues("time");
							if (currentTime && isTimeDisabled(currentTime)) {
								form.setValue("time", "", {
									shouldValidate: true,
									shouldDirty: true,
									shouldTouch: true,
								});
							}
							// Actualizar selectedDate aquí
							setSelectedDate(date);
						}
					}}
					onMonthChange={(date) => {
						setSelectedDate(date);
						console.log("Mes cambiado a:", date);
						console.log("ID de personal actual:", selectedStaffId);
						console.log("ID de sucursal actual:", selectedBranchId);
					}}
				/>
			</div>
			<div className="space-y-4">
				<h3 className="font-semibold">Hora de consulta</h3>
				<p className="text-sm text-muted-foreground">
					{format(selectedDate, "EEEE, d 'de' MMMM, yyyy", {
						locale: es,
					})}
				</p>
				<ScrollArea className="h-[22rem] w-[250px]">
					<div className="grid gap-2 pr-4">
						{filteredTimeSlots.map(timeStr => {
							const isDisabled = isTimeDisabled(timeStr);
							const isSelected = timeStr === selectedTime;

							return (
								<Button
									key={timeStr}
									variant={isSelected ? "default" : "outline"}
									className={cn(
										"w-full justify-start",
										isDisabled && "opacity-50 cursor-not-allowed"
									)}
									disabled={isDisabled}
									onClick={() =>
										form.setValue("time", timeStr, {
											shouldValidate: true,
											shouldDirty: true,
											shouldTouch: true,
										})
									}
								>
									{timeStr}
								</Button>
							);
						})}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}