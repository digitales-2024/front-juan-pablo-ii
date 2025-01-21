"use client";
import { useState } from "react";
import ConsultationForm from "./ConsultationForm";
import LeftPanel from "./LeftPanel";
import { ConsultationSchema, consultationsSchema } from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import ConsultationCalendarTime from "./ConsultationCalendarTime";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, ArrowLeft, ArrowRight } from "lucide-react";

export default function Consultation() {
	const [showForm, setShowForm] = useState(false);
	const [allowPastDates, setAllowPastDates] = useState(false);

	const form = useForm<ConsultationSchema>({
		resolver: zodResolver(consultationsSchema),
		defaultValues: {
			time: "",
			date: new Date(),
			serviceId: "",
			patientId: "",
			description: "",
		},
	});

	const selectedDate = form.watch("date");
	const selectedTime = form.watch("time");

	const canContinueToForm = selectedDate && selectedTime;

	return (
		<Card className="w-full p-8 rounded-lg max-w-7xl mx-auto shadow">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
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
					<Switch
						id="allow-past"
						checked={allowPastDates}
						onCheckedChange={setAllowPastDates}
					/>
					<Label htmlFor="allow-past">Permitir fechas pasadas</Label>
				</div>
			</div>

			<div className="grid grid-cols-[1fr_auto_1fr] gap-8">
				<LeftPanel date={selectedDate} time={selectedTime} />
				<Separator orientation="vertical" className="h-auto" />
				<div className="relative">
					{!showForm ? (
						<div className="pb-12">
							<ConsultationCalendarTime
								form={form}
								allowPastDates={allowPastDates}
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
								<Button
									variant="ghost"
									onClick={() => setShowForm(false)}
									className="gap-2"
								>
									<ArrowLeft className="w-4 h-4" />
									Volver al calendario
								</Button>
								<Button type="submit" className="w-full">
									Guardar
								</Button>
							</CardFooter>
						</ConsultationForm>
					)}
				</div>
			</div>
		</Card>
	);
}
