"use client";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ConsultationSchema } from "../type";
import { useState } from "react";

interface ConsultationCalendarProps {
	form: UseFormReturn<ConsultationSchema>;
}

export default function ConsultationCalendar({
	form,
}: ConsultationCalendarProps) {
	const { date, time } = form.getValues();
	const [isSelectOpen, setIsSelectOpen] = useState(false);

	return (
		<div className="w-auto p-0 flex items-start">
			<Calendar
				mode="single"
				selected={date}
				onSelect={(e) => e && form.setValue("date", e)}
			/>
			<Select
				defaultValue={time}
				onValueChange={(e) => {
					form.setValue("time", e);
					if (date) {
						const [hours, minutes] = e.split(":");
						const newDate = new Date(date.getTime());
						newDate.setHours(parseInt(hours), parseInt(minutes));
						form.setValue("date", newDate);
					}
				}}
				open={isSelectOpen}
				onOpenChange={setIsSelectOpen}
			>
				<SelectTrigger className="font-normal focus:ring-0 w-[120px] my-4 mr-2">
					<SelectValue placeholder="Seleccionar hora" />
				</SelectTrigger>
				<SelectContent className="border-none shadow-none mr-2">
					<ScrollArea className="h-[15rem]">
						{Array.from({ length: 96 }).map((_, i) => {
							const hour = Math.floor(i / 4)
								.toString()
								.padStart(2, "0");
							const minute = ((i % 4) * 15)
								.toString()
								.padStart(2, "0");
							const timeStr = `${hour}:${minute}`;
							return (
								<SelectItem key={i} value={timeStr}>
									{timeStr}
								</SelectItem>
							);
						})}
					</ScrollArea>
				</SelectContent>
			</Select>
		</div>
	);
}
