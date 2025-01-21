"use client";

import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
} from "@/components/ui/combobox";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

interface Option {
	value: string;
	label: string;
}

interface ComboboxSelectBaseProps {
	options: Option[];
	label?: string;
	description?: string;
	placeholder?: string;
	className?: string;
	error?: string;
	disabled?: boolean;
}

// Props para uso sin formulario
interface ComboboxSelectStandaloneProps extends ComboboxSelectBaseProps {
	value?: string;
	onChange?: (value: string) => void;
	useForm?: false;
}

// Props para uso con formulario
interface ComboboxSelectFormProps<T extends Record<string, any>>
	extends ComboboxSelectBaseProps {
	form: UseFormReturn<T>;
	name: keyof T;
	useForm: true;
}

type ComboboxSelectProps<T extends Record<string, any> = Record<string, any>> =
	| ComboboxSelectStandaloneProps
	| ComboboxSelectFormProps<T>;

export default function ComboboxSelect<T extends Record<string, any>>({
	options,
	label,
	description,
	placeholder = "Seleccionar opción",
	className,
	error,
	disabled,
	...props
}: ComboboxSelectProps<T>) {
	// Componente cuando se usa sin formulario
	if (!props.useForm) {
		const { value, onChange } = props;
		return (
			<div className={cn("space-y-2", className)}>
				{label && (
					<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						{label}
					</label>
				)}
				<Combobox
					value={value}
					onChange={onChange}
					disabled={disabled}
				>
					<ComboboxInput placeholder={placeholder} />
					<ComboboxContent>
						{options.map((option) => (
							<ComboboxItem
								key={option.value}
								value={option.value}
								label={option.label}
							>
								{option.label}
							</ComboboxItem>
						))}
					</ComboboxContent>
				</Combobox>
				{description && (
					<p className="text-[0.8rem] text-muted-foreground">
						{description}
					</p>
				)}
				{error && (
					<p className="text-[0.8rem] text-destructive">{error}</p>
				)}
			</div>
		);
	}

	// Componente cuando se usa con formulario
	const { form, name } = props;
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<Combobox
							value={field.value}
							onChange={field.onChange}
							disabled={disabled}
						>
							<ComboboxInput placeholder={placeholder} />
							<ComboboxContent>
								{options.map((option) => (
									<ComboboxItem
										key={option.value}
										value={option.value}
										label={option.label}
									>
										{option.label}
									</ComboboxItem>
								))}
							</ComboboxContent>
						</Combobox>
					</FormControl>
					{description && (
						<FormDescription>{description}</FormDescription>
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export type { Option, ComboboxSelectProps };
