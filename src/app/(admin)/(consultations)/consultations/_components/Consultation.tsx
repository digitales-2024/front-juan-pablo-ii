"use client";
import { useEffect, useState } from "react";
import ConsultationCalendar from "./ConsultationCalendar";
import ConsultationForm from "./ConsultationForm";
import LeftPanel from "./LeftPanel";
import { ConsultationSchema, consultationsSchema } from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Consultation() {
	const showForm = false;
	const [currentDate, setCurrentDate] = useState(new Date('2024-01-01'));

	useEffect(() => {
		setCurrentDate(new Date());
	}, []);

	const form = useForm<ConsultationSchema>({
		resolver: zodResolver(consultationsSchema),
		defaultValues: {
			time: "",
			date: currentDate,
		},
	});

	return (
		<div className="w-full bg-gray-1 px-8 py-6 rounded-md max-w-max mx-auto">
			<div className="flex gap-6">
				<LeftPanel showForm={showForm} date={currentDate} />
				{!showForm ? (
					<ConsultationCalendar form={form} />
				) : (
					<ConsultationForm form={form} />
				)}
			</div>
		</div>
	);
}
