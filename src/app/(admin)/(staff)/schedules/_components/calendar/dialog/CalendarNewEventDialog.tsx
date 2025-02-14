import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useCalendarContext } from "../CalendarContext";
import { DateTimePicker } from "../../form/DateTimePicker";
import { CalendarEvent } from "../../../_types/CalendarTypes";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useStaffSchedules } from "@/app/(admin)/(staff)/staff-schedules/_hooks/useStaffSchedules";

const formSchema = z
	.object({
		title: z.string().min(1, "Título es requerido"),
		start: z.string().datetime(),
		end: z.string().datetime(),
		staffScheduleId: z.string().min(1, "Debe seleccionar un horario"),
	})
	.refine(
		(data) => {
			const start = new Date(data.start);
			const end = new Date(data.end);
			return end >= start;
		},
		{
			message: "La hora final debe ser posterior a la inicial",
			path: ["end"],
		}
	);

export default function CalendarNewEventDialog() {
	const {
		newEventDialogOpen,
		setNewEventDialogOpen,
		date,
		events,
		setEvents,
	} = useCalendarContext();
	const { 
		allStaffSchedulesQuery, 
	} = useStaffSchedules();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			start: format(date, "yyyy-MM-dd'T'HH:mm"),
			end: format(date, "yyyy-MM-dd'T'HH:mm"),
			staffScheduleId: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		const selectedSchedule = allStaffSchedulesQuery.data?.find(
			s => s.id === values.staffScheduleId
		);
		
		const newEvent: CalendarEvent = {
			id: crypto.randomUUID(),
			title: values.title,
			start: new Date(values.start),
			end: new Date(values.end),
			color: selectedSchedule?.color || "blue",
			type: "CITA" as const,
			status: "CONFIRMED" as const,
			staff: {
				name: "Staff Temporal",
				lastName: ""
			},
			branch: {
				name: "Sucursal Temporal"
			},
			recurrence: {
				frequency: "DAILY",
				interval: 1,
				until: "2025-01-01"
			},
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
			isCancelled: false,
			isBaseEvent: false,
			branchId: "temp-branch-id",
			staffId: "temp-staff-id",
			staffScheduleId: values.staffScheduleId
		};

		setEvents([...events, newEvent]);
		setNewEventDialogOpen(false);
		form.reset();
	}

	return (
		<Dialog open={newEventDialogOpen} onOpenChange={setNewEventDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Crear nuevo evento</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="staffScheduleId"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-bold">Horario</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Seleccione un horario" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{allStaffSchedulesQuery.data?.map((schedule) => (
												<SelectItem key={schedule.id} value={schedule.id}>
													{schedule.title} - {schedule.staff?.name} {schedule.staff?.lastName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-bold">Título</FormLabel>
									<FormControl>
										<Input
											placeholder="Nombre del evento"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="start"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-bold">Inicio</FormLabel>
									<FormControl>
										<DateTimePicker field={field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="end"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-bold">Fin</FormLabel>
									<FormControl>
										<DateTimePicker field={field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end">
							<Button type="submit">Crear evento</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
