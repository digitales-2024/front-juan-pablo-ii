"use client";
import { useState, useEffect } from "react";
import ConsultationForm from "./ConsultationForm";
import LeftPanel from "./LeftPanel";
import { ConsultationSchema, consultationsSchema } from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import ConsultationCalendarTime from "./ConsultationCalendarTime";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { useAppointments } from "@/app/(admin)/(appointments)/appointments/_hooks/useAppointments";
import { format } from "date-fns";
import { CreateAppointmentDto } from "@/app/(admin)/(appointments)/appointments/_interfaces/appointments.interface";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useEvents } from "@/app/(admin)/(staff)/schedules/_hooks/useEvents";
import { EventType, EventStatus } from "@/app/(admin)/(staff)/schedules/_interfaces/event.interface";
import { useBilling } from "@/app/(admin)/(payment)/orders/_hooks/useBilling";
import { CreateMedicalAppointmentBillingDto } from "@/app/(admin)/(payment)/orders/_interfaces/order.interface";

interface ConsultationFormProps {
	form: UseFormReturn<ConsultationSchema>;
	children: React.ReactNode;
	onSubmit: (data: ConsultationSchema) => Promise<void>;
}

export default function Consultation() {
	const [showForm, setShowForm] = useState(false);
	const [allowPastDates, setAllowPastDates] = useState(false);
	const [showAvailableDays, setShowAvailableDays] = useState(false);
	const [showAvailableHours, setShowAvailableHours] = useState(false);
	const [selectedStaffId, setSelectedStaffId] = useState("");
	const [selectedBranchId, setSelectedBranchId] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date());
	const { createMutation } = useAppointments();
	const queryClient = useQueryClient();
	const { createMutation: createEventMutation } = useEvents();
	const { createMedicalAppointmentOrderMutation } = useBilling();

	const form = useForm<ConsultationSchema>({
		resolver: zodResolver(consultationsSchema),
		defaultValues: {
			time: "",
			date: format(new Date(), "yyyy-MM-dd"),
			serviceId: "",
			notes: "",
			staffId: "",
			branchId: "",
			patientId: "",
			paymentMethod: undefined,
		},
	});

	// Cada vez que cambie selectedDate, actualizar form.date
	useEffect(() => {
		form.setValue('date', format(selectedDate, "yyyy-MM-dd"));
	}, [selectedDate, form]);

	const selectedTime = form.watch("time");

	const canContinueToForm = selectedDate && selectedTime;

	const handleStaffChange = (staffId: string) => {
		console.log("Cambiando ID de personal a:", staffId);
		setSelectedStaffId(staffId);
		form.setValue("staffId", staffId);
	};

	const handleBranchChange = (branchId: string) => {
		console.log("Cambiando ID de sucursal a:", branchId);
		setSelectedBranchId(branchId);
		form.setValue("branchId", branchId);
	};

	const handleMonthChange = (date: Date) => {
		setSelectedDate(date);
		console.log("Mes cambiado a:", date);
		console.log("ID de personal actual:", selectedStaffId);
		console.log("ID de sucursal actual:", selectedBranchId);
	};

	const handleServiceChange = (serviceId: string) => {
		console.log("Cambiando ID de servicio a:", serviceId);
		form.setValue("serviceId", serviceId);
	};

	const handlePatientChange = (patientId: string) => {
		console.log("Cambiando ID de paciente a:", patientId);
		form.setValue("patientId", patientId);
	};

	const handleDateChange = (date: Date) => {
		setSelectedDate(date);
		form.setValue('date', format(date, "yyyy-MM-dd")); // Actualiza como string
	};

	useEffect(() => {
		console.log('Form values changed:', form.getValues());
	}, [form.watch()]);

	useEffect(() => {
		const formValues = form.getValues();

		if (formValues.time && selectedDate) {
			// Procesar fecha y hora
			const [time, period] = formValues.time.split(/(?=[AaPp][Mm])/);
			const [hours, minutes] = time.split(':');
			let hour24 = parseInt(hours);

			if (period.toLowerCase() === 'pm' && hour24 < 12) {
				hour24 += 12;
			} else if (period.toLowerCase() === 'am' && hour24 === 12) {
				hour24 = 0;
			}

			// Crear fechas ISO
			const startDate = new Date(selectedDate);
			startDate.setHours(hour24);
			startDate.setMinutes(parseInt(minutes));
			startDate.setSeconds(0);
			startDate.setMilliseconds(0);

			const endDate = new Date(startDate);
			// Cambiar de 30 a 15 minutos
			endDate.setMinutes(endDate.getMinutes() + 15);

			console.log('🕒 HORARIOS:', {
				'Hora seleccionada (Perú)': formValues.time,
				'Fecha seleccionada (Perú)': format(selectedDate, 'yyyy-MM-dd'),
				'Inicio (Perú)': new Date(startDate).toLocaleString('es-PE', { timeZone: 'America/Lima' }),
				'Fin (Perú)': new Date(endDate).toLocaleString('es-PE', { timeZone: 'America/Lima' }),
				'Inicio (UTC)': startDate.toISOString(),
				'Fin (UTC)': endDate.toISOString(),
				'Duración': '15 minutos'
			});

			const appointmentPreview = {
				staffId: formValues.staffId,
				serviceId: formValues.serviceId,
				branchId: formValues.branchId,
				patientId: formValues.patientId,
				start: startDate.toISOString(),
				end: endDate.toISOString(),
				type: "CONSULTA" as const,
				notes: formValues.notes || "",
				status: "PENDING" as const,
				paymentMethod: formValues.paymentMethod as "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET"
			};

			console.log('👀 PREVIEW - Así se enviará el appointment:', appointmentPreview);
		}
	}, [form.watch(), selectedDate]);

	// const previewAppointmentData = () => {
	// 	const formValues = form.getValues();

	// 	// Procesar fecha y hora
	// 	const [time, period] = formValues.time.split(/(?=[AaPp][Mm])/);
	// 	const [hours, minutes] = time.split(':');
	// 	let hour24 = parseInt(hours);

	// 	if (period.toLowerCase() === 'pm' && hour24 < 12) {
	// 		hour24 += 12;
	// 	} else if (period.toLowerCase() === 'am' && hour24 === 12) {
	// 		hour24 = 0;
	// 	}

	// 	// Crear fechas ISO
	// 	const startDate = new Date(selectedDate);
	// 	startDate.setHours(hour24);
	// 	startDate.setMinutes(parseInt(minutes));
	// 	startDate.setSeconds(0);
	// 	startDate.setMilliseconds(0);

	// 	const endDate = new Date(startDate);
	// 	// Cambiar de 30 a 15 minutos
	// 	endDate.setMinutes(endDate.getMinutes() + 15);

	// 	const appointmentToCreate = {
	// 		staffId: formValues.staffId,
	// 		serviceId: formValues.serviceId,
	// 		branchId: formValues.branchId,
	// 		patientId: formValues.patientId,
	// 		start: startDate.toISOString(),
	// 		end: endDate.toISOString(),
	// 		type: "CONSULTA" as const,
	// 		notes: formValues.notes || "",
	// 		status: "PENDING" as const,
	// 		paymentMethod: formValues.paymentMethod as "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET"
	// 	};

	// 	console.log('DATOS QUE SE ENVIARÁN AL CREAR APPOINTMENT:', appointmentToCreate);
	// };

	const handleSubmit = async (data: ConsultationSchema) => {
		console.log('🔄 INICIO DE handleSubmit CON DATOS:', data);

		// Validación explícita de campos requeridos
		const requiredFields = ['staffId', 'serviceId', 'branchId', 'patientId', 'time', 'paymentMethod'];
		const missingFields = requiredFields.filter(field => !data[field as keyof ConsultationSchema]);

		if (missingFields.length > 0) {
			console.error('❌ Faltan campos requeridos:', missingFields);
			toast.error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
			return;
		}

		try {
			// Procesar fecha y hora
			console.log('⏱️ Procesando fecha y hora...');
			console.log('📆 Fecha seleccionada (string):', data.date);
			console.log('🕒 Hora seleccionada (Lima):', data.time);

			// Extraer componentes de la hora
			const [time, period] = data.time.split(/(?=[AaPp][Mm])/);
			const [hours, minutes] = time.split(':');
			let hour24 = parseInt(hours);

			if (period.toLowerCase() === 'pm' && hour24 < 12) {
				hour24 += 12;
			} else if (period.toLowerCase() === 'am' && hour24 === 12) {
				hour24 = 0;
			}

			console.log('🕒 Hora convertida a 24h (Lima):', hour24 + ':' + minutes);

			// Parsear la fecha en formato yyyy-MM-dd
			const [year, month, day] = data.date.split('-').map(Number);

			// CORRECCIÓN: Crear la fecha en hora local de Lima y luego convertir a UTC
			// Lima está en UTC-5, por lo que necesitamos sumar 5 horas para obtener UTC
			const limaToUTCOffset = 5; // Diferencia horaria entre Lima y UTC

			// Crear fecha en hora local (Lima)
			const limaDate = new Date(year, month - 1, day, hour24, parseInt(minutes), 0, 0);
			console.log('📅 Fecha en hora local (Lima):', limaDate.toString());

			// Convertir a UTC sumando la diferencia horaria
			const utcHour = hour24 + limaToUTCOffset;
			console.log('🕒 Hora convertida a UTC:', utcHour + ':' + minutes);

			// Crear fecha en UTC
			const startDate = new Date(Date.UTC(year, month - 1, day, utcHour, parseInt(minutes), 0, 0));

			console.log('📅 Fecha creada (UTC):', startDate.toISOString());
			console.log('📅 Fecha creada (local):', startDate.toString());
			console.log('📅 Día del mes (UTC):', startDate.getUTCDate());
			console.log('📅 Hora (UTC):', startDate.getUTCHours() + ':' + startDate.getUTCMinutes());

			// Verificar la conversión a hora de Lima
			const limaHourFromUTC = startDate.getUTCHours() - limaToUTCOffset;
			console.log('🕒 Hora en Lima calculada desde UTC:', limaHourFromUTC + ':' + startDate.getUTCMinutes());

			// Crear fecha de fin (15 minutos después)
			const endDate = new Date(startDate.getTime());
			endDate.setUTCMinutes(endDate.getUTCMinutes() + 15);

			console.log('📅 Fechas procesadas:', {
				startDateUTC: startDate.toISOString(),
				endDateUTC: endDate.toISOString(),
				startHourUTC: startDate.getUTCHours() + ':' + startDate.getUTCMinutes(),
				endHourUTC: endDate.getUTCHours() + ':' + endDate.getUTCMinutes(),
				startHourLima: limaHourFromUTC + ':' + startDate.getUTCMinutes(),
				endHourLima: (limaHourFromUTC) + ':' + endDate.getUTCMinutes(),
				duracionMinutos: 15
			});

			// Crear evento de tipo CITA con color gris usando el hook useEvents
			let eventId = null;
			try {
				console.log('🗓️ Creando evento de calendario para la cita...');

				// Crear el objeto para el evento
				const eventData = {
					title: `Cita: Paciente`,
					color: 'gray', // Color gris inicial
					type: EventType.CITA,
					status: EventStatus.PENDING,
					start: startDate.toISOString(),
					end: endDate.toISOString(),
					staffId: data.staffId,
					branchId: data.branchId
				};

				console.log('📦 Datos del evento a crear:', eventData);

				// Usar la mutación del hook useEvents para crear el evento
				const eventResult = await createEventMutation.mutateAsync(eventData);
				console.log('✅ Evento creado exitosamente:', eventResult);

				// Guardar el ID del evento para asociarlo con la cita
				eventId = eventResult.data?.id;
				console.log('🔑 ID del evento creado:', eventId);
			} catch (eventError) {
				console.error('❌ Error al crear el evento:', eventError);
				// No interrumpimos el flujo principal si falla la creación del evento
			}

			// Crear objeto para createMutation
			const appointmentToCreate: CreateAppointmentDto = {
				staffId: data.staffId,
				serviceId: data.serviceId,
				branchId: data.branchId,
				patientId: data.patientId,
				start: startDate.toISOString(),
				end: endDate.toISOString(),
				type: "CONSULTA" as const,
				notes: data.notes || "",
				status: "PENDING" as const,
				paymentMethod: data.paymentMethod as "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET",
				eventId: eventId || undefined // Añadir el ID del evento a la cita
			};

			console.log('📦 OBJETO FINAL PARA CREAR APPOINTMENT:', appointmentToCreate);
			console.log('⏳ Llamando a createMutation.mutateAsync...');

			const result = await createMutation.mutateAsync(appointmentToCreate);
			console.log('✅ Mutation completada exitosamente con resultado:', result);

			// Invalidar la query después de crear la cita
			queryClient.invalidateQueries({ queryKey: ['paginated-appointments'] });

			console.log("🎉 Appointment creado exitosamente");

			// Crear la orden de facturación para la cita médica
			try {
				console.log('💰 Creando orden de facturación para la cita médica...');

				// Verificar que tenemos el ID del appointment
				if (result.data && result.data.id) {
					// Crear el objeto para la facturación
					const billingData: CreateMedicalAppointmentBillingDto = {
						appointmentId: result.data.id,
						paymentMethod: data.paymentMethod as "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET",
						currency: "PEN", // Moneda peruana (soles)
						notes: data.notes || "",
						metadata: {}
					};

					console.log('📦 Datos de facturación a crear:', billingData);

					// Usar la mutación del hook useBilling para crear la orden
					const billingResult = await createMedicalAppointmentOrderMutation.mutateAsync(billingData);
					console.log('✅ Orden de facturación creada exitosamente:', billingResult);

					// Mostrar mensaje de éxito
					toast.success("Cita agendada y facturada exitosamente");
				} else {
					console.error('❌ No se pudo obtener el ID del appointment para crear la facturación');
					toast.success("Cita agendada exitosamente, pero no se pudo crear la facturación");
				}
			} catch (billingError) {
				console.error('❌ Error al crear la orden de facturación:', billingError);
				toast.success("Cita agendada exitosamente, pero hubo un error al crear la facturación");
				// No interrumpimos el flujo principal si falla la creación de la facturación
			}

			// En lugar de resetear todo el formulario, solo limpiamos algunos campos
			// pero mantenemos la fecha, hora, personal y sucursal seleccionados
			form.setValue("notes", "");
			form.setValue("paymentMethod", "" as any);
			// Mantenemos: date, time, staffId, branchId
			setShowForm(false);
		} catch (error) {
			// Manejo de error mejorado
			console.error('❌ ERROR en handleSubmit:', error);
			if (error instanceof Error) {
				toast.error(`Error al crear la cita: ${error.message}`);
			} else {
				toast.error('Error desconocido al crear la cita');
			}
		}
	};

	return (
		<Card className="w-full p-8 rounded-lg max-w-7xl mx-auto shadow">
			<div className="flex flex-wrap gap-3 items-center justify-between mb-6">
				<div className="flex items-center  gap-2">
					<Button
						variant={showForm ? "outline" : "default"}
						onClick={() => setShowForm(false)}
						className="gap-2"
					>
						<CalendarDays className="w-4 h-4" />
						Calendario
					</Button>
					<Button
						variant={showForm ? "default" : "outline"}
						onClick={() => setShowForm(true)}
						className="gap-2"
						disabled={!canContinueToForm}
					>
						<FileText className="w-4 h-4" />
						Formulario
					</Button>
				</div>
				<div className="flex items-center gap-2">
					{/* <Switch
						id="allow-past"
						checked={allowPastDates}
						onCheckedChange={setAllowPastDates}
					/>
					<Label htmlFor="allow-past">Permitir fechas pasadas</Label> */}
				</div>
				<div className="flex items-center gap-2">
					<Switch
						id="show-available-days"
						checked={showAvailableDays}
						onCheckedChange={setShowAvailableDays}
					/>
					<Label htmlFor="show-available-days">Mostrar solo días disponibles</Label>
				</div>
				<div className="flex items-center gap-2">
					<Switch
						id="show-available-hours"
						checked={showAvailableHours}
						onCheckedChange={setShowAvailableHours}
					/>
					<Label htmlFor="show-available-hours">Mostrar horas disponibles</Label>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] w-full  gap-8">
				<LeftPanel
					date={selectedDate}
					time={selectedTime}
					onStaffChange={handleStaffChange}
					onBranchChange={handleBranchChange}
					onServiceChange={handleServiceChange}
					onPatientChange={handlePatientChange}
				/>
				<div className="relative">
					{!showForm ? (
						<div className="pb-12">
							<ConsultationCalendarTime
								form={form}
								allowPastDates={allowPastDates}
								showAvailableDays={showAvailableDays}
								showAvailableHours={showAvailableHours}
								selectedStaffId={selectedStaffId}
								selectedBranchId={selectedBranchId}
								selectedDate={selectedDate}
								onMonthChange={handleMonthChange}
							/>
							{canContinueToForm && (
								<div className="absolute bottom-0 right-0 mt-4">
									<Button
										onClick={() => setShowForm(true)}
										className="gap-2"
									>
										Continuar
										<ArrowRight className="w-4 h-4" />
									</Button>
								</div>
							)}
						</div>
					) : (
						<ConsultationForm
							form={form}
							onSubmit={handleSubmit}
						>
							<CardFooter className="w-full gap-10">
								<div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
									<Button
										type="submit"
										className="w-full"
									>
										Guardar
									</Button>

									<Button
										variant="ghost"
										type="button"
										onClick={() => setShowForm(false)}
										className="gap-2"
									>
										<ArrowLeft className="w-4 h-4" />
										Volver al calendario
									</Button>
								</div>
							</CardFooter>
						</ConsultationForm>
					)}
				</div>
			</div>
		</Card>
	);
}
