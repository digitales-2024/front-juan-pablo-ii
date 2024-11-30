"use client";

import { Costs, QuotationStructure } from "@/types";
import { ChevronDown, ChevronUp, PencilRuler } from "lucide-react";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { projectNames, projects } from "../../IntegralProjectData";
import CostSummary from "./CostSummary";
import IntegralProjectTable from "./IntegralProjectTable";

interface IntegralProjectProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    area: number;
    costs: Costs;
    updateQuotation?: number;
    setTotalCost: (value: number) => void;
    setCosts: React.Dispatch<React.SetStateAction<Costs>>;
    discount: number;
    setDiscount: React.Dispatch<React.SetStateAction<number>>;
    exchangeRate: number;
    setExchangeRate: React.Dispatch<React.SetStateAction<number>>;
    form: UseFormReturn<QuotationStructure>;
}

export default function IntegralProject({
    area,
    costs,
    discount,
    setDiscount,
    exchangeRate,
    setExchangeRate,
    updateQuotation,
    setTotalCost,
    setCosts,
    form,
}: IntegralProjectProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const subtotal = Object.values(costs).reduce((sum, cost) => sum + cost, 0);

    const handleCostChange = (project: keyof Costs, value: number) => {
        setCosts((prev) => ({
            ...prev,
            [project]: value || 0,
        }));
    };

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="">
                        <div className="flex w-full justify-between">
                            <div
                                className="flex w-full cursor-pointer items-center justify-between"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <div className="flex items-center gap-2">
                                    <PencilRuler size={28} strokeWidth={1.5} />
                                    <span className="text-xl font-bold">
                                        Proyecto Integral de la Cotización
                                    </span>
                                </div>
                                {isOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                {isOpen && (
                    <CardContent>
                        <CollapsibleContent>
                            <div className="mx-auto max-w-4xl space-y-6 p-6">
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                >
                                    {Object.entries(projects).map(
                                        ([key, items]) => (
                                            <AccordionItem
                                                key={key}
                                                value={key}
                                            >
                                                <AccordionTrigger>
                                                    {key}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <Card>
                                                        <CardContent className="pt-6">
                                                            <IntegralProjectTable
                                                                items={items}
                                                                project={
                                                                    Object.keys(
                                                                        projectNames,
                                                                    ).find(
                                                                        (k) =>
                                                                            projectNames[
                                                                                k as keyof Costs
                                                                            ] ===
                                                                            key,
                                                                    ) as keyof Costs
                                                                }
                                                                area={area}
                                                                form={form}
                                                                costs={costs}
                                                                handleCostChange={
                                                                    handleCostChange
                                                                }
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ),
                                    )}
                                </Accordion>
                                <CostSummary
                                    costs={costs}
                                    discount={discount}
                                    exchangeRate={exchangeRate}
                                    subtotal={subtotal}
                                    setDiscount={setDiscount}
                                    setExchangeRate={setExchangeRate}
                                    form={form}
                                    area={area}
                                    setTotalCost={setTotalCost}
                                    {...(updateQuotation && {
                                        updateQuotation,
                                    })}
                                />
                            </div>
                        </CollapsibleContent>
                    </CardContent>
                )}
            </Collapsible>
        </Card>
    );
}
