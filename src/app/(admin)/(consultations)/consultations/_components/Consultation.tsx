"use client";
import { useState, useEffect } from "react";
import ConsultationForm from "./ConsultationForm";
import LeftPanel from "./LeftPanel";
import { ConsultationSchema, consultationsSchema } from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ConsultationCalendarTime from "./ConsultationCalendarTime";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { useAppointments } from "@/app/(admin)/(appointments)/appointments/_hooks/useAppointments";
import { format } from "date-fns";

export default function Consultation() {
	const [showForm, setShowForm] = useState(false);
	const [allowPastDates, setAllowPastDates] = useState(false);
	const [showAvailableDays, setShowAvailableDays] = useState(false);
	const [showAvailableHours, setShowAvailableHours] = useState(false);
	const [selectedStaffId, setSelectedStaffId] = useState("");
	const [selectedBranchId, setSelectedBranchId] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date());
	const { createMutation } = useAppointments();

	const form = useForm<ConsultationSchema>({
		resolver: zodResolver(consultationsSchema),
		defaultValues: {
			time: "",
			date: format(new Date(), "yyyy-MM-dd"),
			serviceId: "",
			notes: "",
			staffId: "",
			branchId: "",
			paymentMethod: undefined,
		},
	});

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
			endDate.setMinutes(endDate.getMinutes() + 30);

			console.log('🕒 HORARIOS:', {
				'Hora seleccionada (Perú)': formValues.time,
				'Fecha seleccionada (Perú)': format(selectedDate, 'yyyy-MM-dd'),
				'Inicio (Perú)': new Date(startDate).toLocaleString('es-PE', { timeZone: 'America/Lima' }),
				'Fin (Perú)': new Date(endDate).toLocaleString('es-PE', { timeZone: 'America/Lima' }),
				'Inicio (UTC)': startDate.toISOString(),
				'Fin (UTC)': endDate.toISOString(),
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

	const previewAppointmentData = () => {
		const formValues = form.getValues();
		
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
		endDate.setMinutes(endDate.getMinutes() + 30);

		const appointmentToCreate = {
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

		console.log('DATOS QUE SE ENVIARÁN AL CREAR APPOINTMENT:', appointmentToCreate);
	};

	const handleSubmit = async (data: ConsultationSchema) => {
		const formValues = form.getValues();
		
		// Mostrar los datos iniciales como los otros logs
		console.log('DATOS DEL FORMULARIO RECIBIDOS:', formValues);

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
		endDate.setMinutes(endDate.getMinutes() + 30);

		// Crear objeto para useAppointments
		const appointmentToCreate = {
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

		// Mostrar el objeto final como los otros logs
		console.log('OBJETO FINAL PARA CREAR APPOINTMENT:', appointmentToCreate);
		console.log('FECHAS PROCESADAS:', {
			fechaInicio: startDate.toISOString(),
			fechaFin: endDate.toISOString()
		});

		try {
			await createMutation.mutateAsync(appointmentToCreate);
			console.log("Appointment creado exitosamente");
			form.reset();
			setShowForm(false);
		} catch (error) {
			console.log('Error al crear appointment:', error);
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
						<ConsultationForm form={form} onSubmit={handleSubmit}>
							<CardFooter className="w-full gap-10">
								<div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
									<Button 
										type="submit" 
										className="w-full"
										onClick={() => {
											console.log('💡 Botón Submit clickeado');
											previewAppointmentData();
										}}
									>
										Guardar
									</Button>
									<Button
										variant="ghost"
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
