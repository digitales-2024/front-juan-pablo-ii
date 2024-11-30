"use client";

import { useDesignProject } from "@/hooks/use-design-project";
import { zodResolver } from "@hookform/resolvers/zod";
import { parse, format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import DatePicker from "../ui/date-time-picker";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";

const contractSchema = z.object({
    contractDate: z.string().min(1, {
        message: "Debes seleccionar una fecha",
    }),
});

export function GenerateContractForm(props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: string;
    publicCode: string;
}) {
    const form = useForm<z.infer<typeof contractSchema>>({
        resolver: zodResolver(contractSchema),
        defaultValues: {
            contractDate: "",
        },
    });
    const { generateContractPdf } = useDesignProject();

    function onSubmit(values: z.infer<typeof contractSchema>) {
        generateContractPdf(props.id, props.publicCode, values.contractDate);
    }

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generar contrato</DialogTitle>
                    <DialogDescription>
                        Ingresa la fecha en la que se firmará el contrato:
                    </DialogDescription>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="contractDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="startDate">
                                            Fecha de inicio de proyecto
                                        </FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                value={
                                                    field.value
                                                        ? parse(
                                                              field.value,
                                                              "yyyy-MM-dd",
                                                              new Date(),
                                                          )
                                                        : undefined
                                                }
                                                onChange={(date) => {
                                                    if (date) {
                                                        const formattedDate =
                                                            format(
                                                                date,
                                                                "yyyy-MM-dd",
                                                            );
                                                        field.onChange(
                                                            formattedDate,
                                                        );
                                                    } else {
                                                        field.onChange("");
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogClose asChild>
                                <Button
                                    disabled={!form.formState.isDirty}
                                    type="submit"
                                >
                                    Generar contrato
                                </Button>
                            </DialogClose>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
