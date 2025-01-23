import { Costs, IntegralProjectItem, QuotationStructure } from "@/types";
import React from "react";
import { UseFormReturn } from "react-hook-form";

import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface IntegralProjectTableProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    items: IntegralProjectItem[];
    project: keyof Costs;
    costs: Costs;
    handleCostChange: (project: keyof Costs, value: number) => void;
    area: number;

    form: UseFormReturn<QuotationStructure>;
}

const IntegralProjectTable: React.FC<IntegralProjectTableProps> = ({
    items,
    project,
    costs,
    handleCostChange,
    form,
}) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[50%]">Descripción</TableHead>
                <TableHead>Unidad</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {items.map((item, index) => (
                <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.unit ? item.unit : ""}</TableCell>
                </TableRow>
            ))}
            <TableRow>
                <TableCell className="font-medium">Costo Total</TableCell>
                <TableCell>
                    <FormField
                        control={form.control}
                        name={project}
                        render={({ field }) => (
                            <FormItem>
                                <Input
                                    type="number"
                                    className="w-[100px]"
                                    value={costs[project]}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        field.onChange(value);
                                        handleCostChange(project, value);
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
);

export default IntegralProjectTable;
