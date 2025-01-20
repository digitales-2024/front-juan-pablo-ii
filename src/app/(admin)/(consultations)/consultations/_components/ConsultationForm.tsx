"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ConsultationSchema } from "../type";

interface ConsultationFormProps {
	form: UseFormReturn<ConsultationSchema>;
}

export default function ConsultationForm({ form }: ConsultationFormProps) {
	function onSubmit() {}
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
					className="space-y-5 p-5"
				>
					<CardContent>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="shadcn"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This is your public display name.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button type="submit">Submit</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
