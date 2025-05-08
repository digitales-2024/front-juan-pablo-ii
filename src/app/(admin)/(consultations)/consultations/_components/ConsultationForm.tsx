"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import type{ UseFormReturn } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import type { ConsultationSchema } from "../type";
import ComboboxSelect from "@/components/ui/combobox-select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { toast } from "sonner";

interface ConsultationFormProps {
	form: UseFormReturn<ConsultationSchema>;
	children: React.ReactNode;
	onSubmit: (data: ConsultationSchema) => void;
}

const ListPaymentMethods = [
	{
		value: "CASH",
		label: "Efectivo",
	},
	{
		value: "BANK_TRANSFER",
		label: "Targeta / Transferencia",
	},
	{
		value: "DIGITAL_WALLET",
		label: "Billetera Digital",
	},
];

export default function ConsultationForm({
	form,
	children,
	onSubmit,
}: ConsultationFormProps) {
	console.log('🧩 ConsultationForm renderizado, onSubmit es:', typeof onSubmit);

	const handleFormSubmit = async (data: ConsultationSchema) => {
		console.group('📝 DATOS DEL FORMULARIO AL ENVIAR');
		console.log('Valores del formulario:', data);

		// Validación adicional antes de enviar
		const formValues = form.getValues();
		const requiredFields = ['staffId', 'serviceId', 'branchId', 'patientId', 'paymentMethod'];
		const emptyFields = requiredFields.filter(field => {
			const value = formValues[field as keyof ConsultationSchema];
			return !value || (typeof value === 'string' && value.trim() === '');
		});

		if (emptyFields.length > 0) {
			console.error('❌ Campos requeridos vacíos:', emptyFields);
			toast.error('Por favor complete todos los campos requeridos');
			console.groupEnd();
			return;
		}

		try {
			await onSubmit(data);
			console.log('✅ Formulario procesado exitosamente');
		} catch (error) {
			console.error('❌ Error al procesar el formulario:', error);
		}
		console.groupEnd();
	};

	// Obtener los valores actuales del formulario para mostrar en el resumen
	const paymentMethod = form.watch("paymentMethod");
	const paymentMethodLabel = ListPaymentMethods.find(method => method.value === paymentMethod)?.label ?? "No seleccionado";

	return (
		<Card>
			<CardHeader>
				<CardTitle>Detalles de la Consulta</CardTitle>
				<CardDescription>
					Por favor, completa tus datos para agendar la consulta.
				</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form
					onSubmit={(e) => {
						e.preventDefault(); // Prevenir el comportamiento por defecto
						console.log('📤 Evento submit del formulario capturado');
						const values = form.getValues();
						console.log('📊 Valores del formulario:', values);

						// Llamar directamente a onSubmit con los valores actuales del formulario
						try {
							onSubmit(values);
							console.log('✅ onSubmit llamado exitosamente');
						} catch (error) {
							console.error('❌ Error al llamar onSubmit:', error);
						}
					}}
					className="space-y-5"
				>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Fecha</FormLabel>
										<FormControl>
											<Input
												value={typeof field.value === 'string'
													? field.value
													: format(field.value, "yyyy-MM-dd")}
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
						</div>
						{/* <FormField
							control={form.control}
							name="serviceId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sucursal</FormLabel>
									<FormControl>
										<ComboboxSelect
											options={ListSucursal}
											{...field}
											description="Selecciona la sucursal donde se realizará la consulta"
											placeholder="Selecciona un sucursal"
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
						)}
						/> */}

						<FormField
							control={form.control}
							name="paymentMethod"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Método de Pago</FormLabel>
									<FormControl>
										<ComboboxSelect
											options={ListPaymentMethods}
											value={field.value || ""}
											onChange={field.onChange}
											description="Selecciona el método de pago"
											placeholder="Selecciona un método de pago"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="notes"
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

						{/* Resumen de facturación */}
						<Alert className="bg-blue-50 border-blue-200">
							<InfoIcon className="h-4 w-4 text-blue-500" />
							<AlertTitle className="text-blue-700">Información de facturación</AlertTitle>
							<AlertDescription className="text-blue-600">
								<p>Al guardar esta cita, se generará automáticamente una orden de facturación con los siguientes detalles:</p>
								<ul className="list-disc pl-5 mt-2 space-y-1">
									<li>Tipo: Cita médica</li>
									<li>Estado: Pendiente</li>
									<li>Método de pago: {paymentMethodLabel}</li>
									<li>Moneda: PEN (Soles)</li>
									<li>Se asociará automáticamente con el ID de la cita creada</li>
								</ul>
							</AlertDescription>
						</Alert>
					</CardContent>
					{children}
				</form>
			</Form>
		</Card>
	);
}
