import { UseFormReturn } from "react-hook-form";
import { ConsultationSchema } from "../type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CalendarBig } from "./calendar/CalendarBig";
import { format, isBefore, isToday, startOfDay, startOfToday, startOfMonth, endOfMonth, subDays, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";
import { useEvents } from "@/app/(admin)/(staff)/schedules/_hooks/useEvents";
import { useAppointments } from "@/app/(admin)/(appointments)/appointments/_hooks/useAppointments";
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
	const [existingAppointments, setExistingAppointments] = useState<any[]>([]);

	// Actualizar selectedDate cuando cambie initialSelectedDate
	useEffect(() => {
		setSelectedDate(initialSelectedDate);
		console.log("initialSelectedDate actualizado:", initialSelectedDate);
	}, [initialSelectedDate]);

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

	// Obtener las citas existentes
	const { appointmentsQuery } = useAppointments();

	// Filtrar las citas para el doctor y la fecha seleccionada
	useEffect(() => {
		if (appointmentsQuery.data && selectedStaffId) {
			// Mostrar todas las citas para depuración
			const allAppointments = appointmentsQuery.data.filter(appointment => {
				const appointmentDate = new Date(appointment.start);
				const selectedDateOnly = new Date(selectedDate);
				selectedDateOnly.setHours(0, 0, 0, 0);

				return appointment.staffId === selectedStaffId &&
					format(appointmentDate, 'yyyy-MM-dd') === format(selectedDateOnly, 'yyyy-MM-dd');
			});

			console.log("TODAS las citas para esta fecha y doctor:", allAppointments);
			console.log("Estados de las citas:", allAppointments.map(a => `${format(new Date(a.start), 'HH:mm')} - ${a.status}`));

			// Filtrar solo las confirmadas
			const confirmedAppointments = allAppointments.filter(appointment =>
				appointment.status === 'CONFIRMED' && appointment.isActive
			);

			console.log("Citas CONFIRMADAS para esta fecha y doctor:", confirmedAppointments);
			console.log("¿Hay citas CONFIRMADAS?", confirmedAppointments.length > 0 ? "SÍ" : "NO");
			console.log("Horarios de citas CONFIRMADAS:", confirmedAppointments.map(a =>
				`${format(new Date(a.start), 'HH:mm')} - ${format(new Date(a.end), 'HH:mm')}`
			));

			if (confirmedAppointments.length === 0) {
				console.log("NO HAY CITAS CONFIRMADAS, todas las horas deberían estar disponibles (si están dentro de un TURNO)");
			}

			setExistingAppointments(confirmedAppointments);
		}
	}, [appointmentsQuery.data, selectedStaffId, selectedDate]);

	// Parse available days from events
	const availableDays = (events || []).map(event => new Date(event.start));

	// Filtrar horas disponibles para el día seleccionado
	const availableHoursForSelectedDate = (events || []).filter(event => {
		const eventStart = new Date(event.start);
		const eventEnd = new Date(event.end);
		const selectedDateStart = new Date(selectedDate);
		selectedDateStart.setHours(0, 0, 0, 0);
		const selectedDateEnd = new Date(selectedDate);
		selectedDateEnd.setHours(23, 59, 59, 999);

		// Verificar si el evento ocurre en la fecha seleccionada o la cubre
		// Un TURNO puede comenzar antes o terminar después del día seleccionado
		// Lo importante es que cubra alguna parte del día seleccionado

		// Convertir a UTC para comparaciones consistentes
		const eventStartUTC = eventStart.toISOString();
		const eventEndUTC = eventEnd.toISOString();
		const selectedDateStartUTC = selectedDateStart.toISOString();
		const selectedDateEndUTC = selectedDateEnd.toISOString();

		console.log(`Comparando evento ${format(eventStart, 'yyyy-MM-dd HH:mm')} - ${format(eventEnd, 'yyyy-MM-dd HH:mm')} con fecha seleccionada ${format(selectedDate, 'yyyy-MM-dd')}`);

		// Un evento cubre el día seleccionado si:
		// 1. Comienza antes o durante el día seleccionado Y
		// 2. Termina durante o después del día seleccionado
		const eventCoversSelectedDay =
			(eventStart <= selectedDateEnd) && (eventEnd >= selectedDateStart);

		console.log(`¿El evento cubre el día seleccionado? ${eventCoversSelectedDay ? 'SÍ' : 'NO'}`);

		return eventCoversSelectedDay;
	}).map(event => {
		const start = new Date(event.start);
		const end = new Date(event.end);

		// Ajustar las horas de inicio y fin para que estén dentro del día seleccionado
		const dayStart = new Date(selectedDate);
		dayStart.setHours(0, 0, 0, 0);

		const dayEnd = new Date(selectedDate);
		dayEnd.setHours(23, 59, 59, 999);

		// Si el evento comienza antes del día seleccionado, usar el inicio del día
		const adjustedStart = start < dayStart ? dayStart : start;
		// Si el evento termina después del día seleccionado, usar el fin del día
		const adjustedEnd = end > dayEnd ? dayEnd : end;

		console.log(`Evento encontrado para la fecha ${format(selectedDate, 'yyyy-MM-dd')}:`);
		console.log(`- ID: ${event.id}`);
		console.log(`- Título: ${event.title || 'Sin título'}`);
		console.log(`- Tipo: ${event.type}`);
		console.log(`- Inicio original: ${format(start, 'yyyy-MM-dd HH:mm:ss')}`);
		console.log(`- Fin original: ${format(end, 'yyyy-MM-dd HH:mm:ss')}`);
		console.log(`- Inicio ajustado: ${format(adjustedStart, 'yyyy-MM-dd HH:mm:ss')}`);
		console.log(`- Fin ajustado: ${format(adjustedEnd, 'yyyy-MM-dd HH:mm:ss')}`);
		console.log(`- Duración ajustada: ${(adjustedEnd.getTime() - adjustedStart.getTime()) / (1000 * 60)} minutos`);

		// Crear un array de intervalos de 15 minutos dentro del rango ajustado
		const timeSlots = [];
		for (let d = new Date(adjustedStart); d < adjustedEnd; d.setMinutes(d.getMinutes() + 15)) {
			// Formatear la hora en el formato "09:00am" en lugar de usar toLocaleTimeString
			const hours = d.getHours();
			const minutes = d.getMinutes();
			const period = hours >= 12 ? 'pm' : 'am';
			const hour12 = hours % 12 || 12;
			const formattedHour = hour12.toString().padStart(2, '0');
			const formattedMinutes = minutes.toString().padStart(2, '0');
			const timeSlot = `${formattedHour}:${formattedMinutes}${period}`;
			timeSlots.push(timeSlot);
			console.log(`- Horario generado: ${timeSlot}`);
		}

		return {
			timeSlots,
			id: event.id,
			title: event.title,
			type: event.type,
			start: format(start, 'yyyy-MM-dd HH:mm:ss'),
			end: format(end, 'yyyy-MM-dd HH:mm:ss')
		};
	});

	console.log("Eventos disponibles para la fecha seleccionada:", availableHoursForSelectedDate);
	console.log("Total de eventos para esta fecha:", availableHoursForSelectedDate.length);

	if (availableHoursForSelectedDate.length === 0) {
		console.log("⚠️ NO HAY TURNOS DISPONIBLES PARA ESTA FECHA");
	}

	// Crear un array de horarios en formato de 12 horas con intervalos de 15 minutos
	const timeSlots = [
		"08:00am", "08:15am", "08:30am", "08:45am",
		"09:00am", "09:15am", "09:30am", "09:45am",
		"10:00am", "10:15am", "10:30am", "10:45am",
		"11:00am", "11:15am", "11:30am", "11:45am",
		"12:00pm", "12:15pm", "12:30pm", "12:45pm",
		"01:00pm", "01:15pm", "01:30pm", "01:45pm",
		"02:00pm", "02:15pm", "02:30pm", "02:45pm",
		"03:00pm", "03:15pm", "03:30pm", "03:45pm",
		"04:00pm", "04:15pm", "04:30pm", "04:45pm",
		"05:00pm", "05:15pm", "05:30pm", "05:45pm",
		"06:00pm", "06:15pm", "06:30pm", "06:45pm",
		"07:00pm", "07:15pm", "07:30pm", "07:45pm"
	];

	// Filtrar los horarios disponibles en base a los eventos
	const filteredTimeSlots = showAvailableHours
		? [...new Set(availableHoursForSelectedDate.flatMap(event => event.timeSlots))]
		: timeSlots;

	console.log("Horarios disponibles después de filtrar:", filteredTimeSlots);
	console.log("¿Mostrar solo horarios disponibles?", showAvailableHours);
	console.log("Horarios totales:", timeSlots.length);
	console.log("Horarios filtrados:", filteredTimeSlots.length);

	// Agregar estos logs para depuración
	console.log("Hora seleccionada:", selectedTime);
	console.log("Evento encontrado para la fecha:", availableHoursForSelectedDate);
	console.log("Horarios disponibles después de filtrar:", filteredTimeSlots);

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
		// Agregar logs para depuración
		const dateStr = format(date, 'yyyy-MM-dd');
		const isAvailable = availableDays.some(availableDate =>
			format(availableDate, 'yyyy-MM-dd') === dateStr
		);

		console.log(`Fecha ${dateStr}: ${isAvailable ? 'DISPONIBLE (tiene turnos)' : 'NO DISPONIBLE (sin turnos)'}`);

		// Si allowPastDates está desactivado, deshabilitar fechas pasadas
		if (!allowPastDates && isBefore(startOfDay(date), startOfToday())) {
			console.log(`Fecha ${dateStr}: DESHABILITADA (fecha pasada)`);
			return true;
		}

		// IMPORTANTE: Solo aplicar filtros de disponibilidad cuando showAvailableDays esté activado
		// Esto permite crear consultas en cualquier fecha cuando el switch está desactivado
		if (showAvailableDays) {
			// Solo cuando el switch está activado, filtrar por días disponibles
			if (!isAvailable) {
				console.log(`Fecha ${dateStr}: DESHABILITADA (no tiene turnos disponibles y filtro activado)`);
				return true;
			}
		}

		console.log(`Fecha ${dateStr}: HABILITADA (cumple todas las condiciones)`);
		return false;
	};

	const isTimeDisabled = (timeStr: string) => {
		// Si no hay staff o branch seleccionado, deshabilitar todas las horas
		if (!selectedStaffId || !selectedBranchId) {
			console.log(`Hora ${timeStr}: DESHABILITADA (no hay staff o sucursal seleccionada)`);
			return true;
		}

		// Verificar si la hora está en los horarios disponibles según los turnos
		const isAvailableInTurns = filteredTimeSlots.includes(timeStr);

		// IMPORTANTE: Solo aplicar filtros de horarios disponibles cuando showAvailableHours esté activado
		// Esto permite crear consultas en cualquier hora cuando el switch está desactivado
		if (showAvailableHours && !isAvailableInTurns) {
			console.log(`Hora ${timeStr}: DESHABILITADA (no está dentro de ningún TURNO disponible y filtro activado)`);
			return true;
		}

		// Verificar si ya hay una cita CONFIRMADA que comience en esta hora exacta
		const [timePart, period] = timeStr.split(/(?=[AaPp][Mm])/);
		if (!period) {
			console.log(`Hora ${timeStr}: DESHABILITADA (formato inválido)`);
			return true; // Si no tiene el formato esperado, deshabilitar
		}

		const [hoursStr, minutesStr] = timePart.split(":");
		let hours = Number(hoursStr);
		const minutes = Number(minutesStr);

		// Convertir a 24 horas
		if (period.toLowerCase() === 'pm' && hours < 12) {
			hours += 12;
		} else if (period.toLowerCase() === 'am' && hours === 12) {
			hours = 0;
		}

		const selectedDateTime = new Date(selectedDate);
		selectedDateTime.setHours(hours, minutes, 0, 0);

		// Verificar si hay alguna cita CONFIRMADA que comience en esta hora exacta
		const conflictingAppointment = existingAppointments.find(appointment => {
			const appointmentStart = new Date(appointment.start);
			return appointment.status === 'CONFIRMED' &&
				appointment.isActive &&
				appointmentStart.getHours() === hours &&
				appointmentStart.getMinutes() === minutes;
		});

		if (conflictingAppointment) {
			console.log(`Hora ${timeStr}: DESHABILITADA (ya tiene una cita CONFIRMADA programada)`);
			console.log(`Detalles de la cita conflictiva:`, {
				id: conflictingAppointment.id,
				start: new Date(conflictingAppointment.start).toLocaleString(),
				end: new Date(conflictingAppointment.end).toLocaleString(),
				status: conflictingAppointment.status
			});
			return true;
		}

		// Verificar si hay alguna cita CONFIRMADA que se solape con esta hora
		const overlappingAppointment = existingAppointments.find(appointment => {
			if (appointment.status !== 'CONFIRMED' || !appointment.isActive) {
				return false;
			}

			const appointmentStart = new Date(appointment.start);
			const appointmentEnd = new Date(appointment.end);

			// Crear fecha de fin (15 minutos después)
			const selectedDateTimeEnd = new Date(selectedDateTime);
			selectedDateTimeEnd.setMinutes(selectedDateTimeEnd.getMinutes() + 15);

			// Verificar solapamiento
			return (
				(selectedDateTime < appointmentEnd && selectedDateTimeEnd > appointmentStart) ||
				(selectedDateTime.getTime() === appointmentStart.getTime())
			);
		});

		if (overlappingAppointment) {
			console.log(`Hora ${timeStr}: DESHABILITADA (se solapa con una cita CONFIRMADA existente)`);
			console.log(`Detalles de la cita solapada:`, {
				id: overlappingAppointment.id,
				start: new Date(overlappingAppointment.start).toLocaleString(),
				end: new Date(overlappingAppointment.end).toLocaleString(),
				status: overlappingAppointment.status
			});
			return true;
		}

		// Si es hoy, verificar si la hora ya pasó
		if (isToday(selectedDate)) {
			const isPast = isBefore(selectedDateTime, now);
			if (isPast && !allowPastDates) {
				console.log(`Hora ${timeStr}: DESHABILITADA (hora pasada para hoy)`);
				return true;
			}
		}

		// Si allowPastDates está desactivado y la fecha es pasada, deshabilitar
		if (!allowPastDates && isBefore(startOfDay(selectedDate), startOfToday())) {
			console.log(`Hora ${timeStr}: DESHABILITADA (fecha pasada y allowPastDates desactivado)`);
			return true;
		}

		// COMENTADO: No aplicar validación de turnos automáticamente
		// Solo aplicar cuando showAvailableHours esté activado (ya se validó arriba)
		/*
		if (!showAvailableHours && availableHoursForSelectedDate.length > 0) {
			// Verificar si la hora está dentro de algún TURNO
			const isWithinAnyTurn = availableHoursForSelectedDate.some(event => {
				// Convertir las horas de inicio y fin del evento a objetos Date
				const eventStart = new Date(event.start);
				const eventEnd = new Date(event.end);

				// Crear un objeto Date para la hora seleccionada
				const timeDate = new Date(selectedDate);
				timeDate.setHours(hours, minutes, 0, 0);

				// Verificar si la hora está dentro del rango del evento
				return timeDate >= eventStart && timeDate < eventEnd;
			});

			if (!isWithinAnyTurn) {
				console.log(`Hora ${timeStr}: DESHABILITADA (no está dentro de ningún TURNO disponible)`);
				return true;
			}
		}
		*/

		console.log(`Hora ${timeStr}: HABILITADA (cumple todas las condiciones)`);
		return false;
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
							// Asegurarnos de que la fecha se maneje correctamente
							console.log('🗓️ Fecha seleccionada en calendario:', date);
							console.log('🗓️ Fecha seleccionada (ISO):', date.toISOString());
							console.log('🗓️ Día del mes:', date.getDate());

							// Formatear la fecha como yyyy-MM-dd
							const formattedDate = format(date, "yyyy-MM-dd");
							console.log('🗓️ Fecha formateada:', formattedDate);

							// Actualizar el valor en el formulario
							form.setValue("date", formattedDate, {
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

							// Notificar al componente padre sobre el cambio de fecha
							if (onMonthChange) {
								console.log("Notificando cambio de fecha al componente padre:", date);
								onMonthChange(date);
							}
						}
					}}
					onMonthChange={(date) => {
						console.log("Mes cambiado a:", date);
						console.log("Mes cambiado (ISO):", date.toISOString());
						console.log("ID de personal actual:", selectedStaffId);
						console.log("ID de sucursal actual:", selectedBranchId);

						// No actualizamos selectedDate aquí para evitar cambios inesperados
						// Solo notificamos al componente padre
						if (onMonthChange) {
							onMonthChange(date);
						}
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
				<p className="text-xs text-muted-foreground font-semibold">
					Horario de Lima (GMT-5)
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
									onClick={() => {
										console.log("Seleccionando hora (Lima):", timeStr);

										// Extraer componentes de la hora para mostrar la conversión a UTC
										const [timePart, period] = timeStr.split(/(?=[AaPp][Mm])/);
										const [hours, minutes] = timePart.split(":");
										let hour24 = Number(hours);

										if (period.toLowerCase() === 'pm' && hour24 < 12) {
											hour24 += 12;
										} else if (period.toLowerCase() === 'am' && hour24 === 12) {
											hour24 = 0;
										}

										// Lima está en UTC-5
										const utcHour = (hour24 + 5) % 24;
										console.log(`Hora seleccionada: ${timeStr} (Lima) = ${utcHour}:${minutes} (UTC)`);

										form.setValue("time", timeStr, {
											shouldValidate: true,
											shouldDirty: true,
											shouldTouch: true,
										});
									}}
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