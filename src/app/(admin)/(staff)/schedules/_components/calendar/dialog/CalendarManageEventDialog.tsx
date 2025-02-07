import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useCalendarContext } from "../CalendarContext";
import { Label } from "@/components/ui/label";
const formSchema = z
	.object({
		title: z.string().min(1, "Title is required"),
		start: z.string().refine((val) => !isNaN(Date.parse(val)), {
			message: "Invalid start date",
		}),
		end: z.string().refine((val) => !isNaN(Date.parse(val)), {
			message: "Invalid end date",
		}),
		color: z.string(),
	})
	.refine(
		(data) => {
			try {
				const start = new Date(data.start);
				const end = new Date(data.end);
				return end >= start;
			} catch {
				return false;
			}
		},
		{
			message: "End time must be after start time",
			path: ["end"],
		}
	);

export default function CalendarManageEventDialog() {
	const {
		manageEventDialogOpen,
		setManageEventDialogOpen,
		selectedEvent,
		setSelectedEvent,
	} = useCalendarContext();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			start: "",
			end: "",
			color: "blue",
		},
	});

	useEffect(() => {
		if (selectedEvent) {
			form.reset({
				title: selectedEvent.title,
				start: format(selectedEvent.start, "yyyy-MM-dd'T'HH:mm"),
				end: format(selectedEvent.end, "yyyy-MM-dd'T'HH:mm"),
				color: selectedEvent.color,
			});
		}
	}, [selectedEvent, form]);


	function handleClose() {
		setManageEventDialogOpen(false);
		setSelectedEvent(null);
		form.reset();
	}

	return (
		<Dialog open={manageEventDialogOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Detalles</DialogTitle>
				</DialogHeader>
				
				<div className="space-y-6">
					<h2 className="text-2xl font-bold text-center text-primary">
						{selectedEvent?.title}
					</h2>
					
					<div className="grid grid-cols-1 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium text-muted-foreground">
								Personal asignado
							</Label>
							<div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
								<span className="font-semibold">
									{selectedEvent?.staff.name} {selectedEvent?.staff.lastName}
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-medium text-muted-foreground">
								Detalles del evento
							</Label>
							<div className="grid grid-cols-2 gap-4 p-3 bg-accent rounded-lg">
								<div>
									<p className="text-sm text-muted-foreground">Tipo</p>
									<p className="font-medium capitalize">{selectedEvent?.type.toLowerCase()}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Estado</p>
									<p className="font-medium text-green-600">{selectedEvent?.status}</p>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-medium text-muted-foreground">
								Ubicación y horario
							</Label>
							<div className="p-3 space-y-2 bg-accent rounded-lg">
								<div>
									<p className="text-sm text-muted-foreground">Sucursal</p>
									<p className="font-medium">{selectedEvent?.branch.name}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Horario</p>
									<p className="font-medium">
										{format(selectedEvent?.start ?? new Date(), "dd/MM/yyyy HH:mm")} - {" "}
										{format(selectedEvent?.end ?? new Date(), "HH:mm")}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
