"use client";
import { useState } from "react";
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

export default function Consultation() {
	const [showForm, setShowForm] = useState(false);
	const [allowPastDates, setAllowPastDates] = useState(false);
	const [showAvailableDays, setShowAvailableDays] = useState(false);
	const [showAvailableHours, setShowAvailableHours] = useState(false);
	const [selectedStaffId, setSelectedStaffId] = useState("");
	const [selectedBranchId, setSelectedBranchId] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date());

	const form = useForm<ConsultationSchema>({
		resolver: zodResolver(consultationsSchema),
		defaultValues: {
			time: "",
			date: new Date(),
			serviceId: "",
			description: "",
			staffId: "",
			branchId: "",
		},
	});

	const selectedTime = form.watch("time");

	const canContinueToForm = selectedDate && selectedTime;

	const handleStaffChange = (staffId: string) => {
		console.log("Cambiando ID de personal a:", staffId);
		setSelectedStaffId(staffId);
	};

	const handleBranchChange = (branchId: string) => {
		console.log("Cambiando ID de sucursal a:", branchId);
		setSelectedBranchId(branchId);
	};

	const handleMonthChange = (date: Date) => {
		setSelectedDate(date);
		console.log("Mes cambiado a:", date);
		console.log("ID de personal actual:", selectedStaffId);
		console.log("ID de sucursal actual:", selectedBranchId);
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
						<ConsultationForm form={form}>
							<CardFooter className="w-full gap-10">
								<div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
									<Button type="submit" className="w-full">
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
