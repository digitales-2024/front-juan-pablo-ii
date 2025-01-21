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
import { Card } from "@/components/ui/card";

export default function Consultation() {
	const showForm = false;
	const [allowPastDates, setAllowPastDates] = useState(false);

	const form = useForm<ConsultationSchema>({
		resolver: zodResolver(consultationsSchema),
		defaultValues: {
			time: "",
			date: new Date(),
		},
		mode: "onChange",
	});

	const selectedDate = form.watch("date");
	const selectedTime = form.watch("time");

	return (
		<Card className="w-full p-8 rounded-lg max-w-7xl mx-auto shadow">
			<div className="flex items-center justify-end mb-6 gap-2">
				<Switch
					id="allow-past"
					checked={allowPastDates}
					onCheckedChange={setAllowPastDates}
				/>
				<Label htmlFor="allow-past">Permitir fechas pasadas</Label>
			</div>
			<div className="grid grid-cols-[1fr_auto_1fr] gap-8">
				<LeftPanel
					showForm={showForm}
					date={selectedDate}
					time={selectedTime}
				/>
				<Separator orientation="vertical" className="h-auto" />
				{!showForm ? (
					<ConsultationCalendarTime
						form={form}
						allowPastDates={allowPastDates}
					/>
				) : (
					<ConsultationForm form={form} />
				)}
			</div>
		</Card>
	);
}
