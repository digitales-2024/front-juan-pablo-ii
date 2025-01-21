"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ConsultationSchema } from "../type";
import ComboboxSelect from "@/components/ui/combobox-select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface ConsultationFormProps {
	form: UseFormReturn<ConsultationSchema>;
	children: React.ReactNode;
}

//TODO - Mover a un archivo de constantes o servicio API
const ListServices = [
	{
		value: "1",
		label: "Plasma Rico en Plaquetas",
	},
	{
		value: "2",
		label: "Toxina Botulínica",
	},
	{
		value: "3",
		label: "Vitaminas C",
	},
	{
		value: "4",
		label: "Ácido Hialurónico",
	},
	{
		value: "5",
		label: "Limpieza Facial",
	},
	{
		value: "6",
		label: "Criolipolisis",
	},
];

const ListPatients = [
	{
		value: "1",
		label: "Paciente 1",
	},
	{
		value: "2",
		label: "Paciente 2",
	},
	{
		value: "3",
		label: "Paciente 3",
	},
	{
		value: "4",
		label: "Paciente 4",
	},
	{
		value: "5",
		label: "Paciente 5",
	},
];

export default function ConsultationForm({
	form,
	children,
}: ConsultationFormProps) {
	function onSubmit(data: ConsultationSchema) {
		console.log(data);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Información de la Consulta</CardTitle>
				<CardDescription>
					Por favor, completa tus datos para agendar la consulta.
				</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-5"
				>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fecha</FormLabel>
									<FormControl>
										<Input
											value={format(
												field.value,
												"yyyy-MM-dd"
											)}
											readOnly
											className="cursor-not-allowed"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="time"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Hora</FormLabel>
									<FormControl>
										<Input
											{...field}
											readOnly
											className="cursor-not-allowed"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="serviceId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Servicio</FormLabel>
									<FormControl>
										<ComboboxSelect
											options={ListServices}
											{...field}
											description="Selecciona el servicio que deseas agendar"
											placeholder="Selecciona un servicio"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="patientId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Paciente</FormLabel>
									<FormControl>
										<ComboboxSelect
											options={ListPatients}
											value={field.value}
											onChange={field.onChange}
											description="Selecciona el paciente que deseas agendar"
											placeholder="Selecciona un paciente"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descripción</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder="Escribe una descripción o notas adicionales"
										/>
									</FormControl>
									<FormDescription>
										Agrega cualquier información adicional
										relevante
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					{children}
				</form>
			</Form>
		</Card>
	);
}
