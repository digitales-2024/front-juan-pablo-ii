import { UseFormReturn } from "react-hook-form";
import { ConsultationSchema } from "../type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CalendarBig } from "./calendar/CalendarBig";
import { Separator } from "@/components/ui/separator";
import { format, isBefore, isToday, startOfDay, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";

interface ConsultationCalendarTimeProps {
	form: UseFormReturn<ConsultationSchema>;
	allowPastDates: boolean;
}

export default function ConsultationCalendarTime({
	form,
	allowPastDates,
}: ConsultationCalendarTimeProps) {
	// Usar watch para observar cambios en tiempo real
	const selectedDate = form.watch("date");
	const selectedTime = form.watch("time");
	const now = new Date();

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
		<div className="w-auto space-x-10 flex items-start">
			<div className="space-y-4">
				<h3 className="font-semibold">Fecha de consulta</h3>
				<CalendarBig
					locale={es}
					selected={selectedDate}
					mode="single"
					disabled={isDateDisabled}
					defaultMonth={selectedDate}
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
						}
					}}
				/>
			</div>
			<Separator orientation="vertical" />
			<div className="space-y-4">
				<h3 className="font-semibold">Hora de consulta</h3>
				<p className="text-sm text-muted-foreground">
					{format(selectedDate, "EEEE, d 'de' MMMM, yyyy", {
						locale: es,
					})}
				</p>
				<ScrollArea className="h-[22rem] w-[250px]">
					<div className="grid gap-2 pr-4">
						{Array.from({ length: 96 }).map((_, i) => {
							const hour = Math.floor(i / 4)
								.toString()
								.padStart(2, "0");
							const minute = ((i % 4) * 15)
								.toString()
								.padStart(2, "0");
							const timeStr = `${hour}:${minute}`;
							const isDisabled = isTimeDisabled(timeStr);
							const isSelected = timeStr === selectedTime;

							return (
								<Button
									key={timeStr}
									variant={isSelected ? "default" : "outline"}
									className={cn(
										"w-full justify-start",
										isDisabled &&
											"opacity-50 cursor-not-allowed"
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
