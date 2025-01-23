"use client";
import { useExchangeRate } from "@/hooks/use-exchange-rate-sunat";
import { createQuotationSchema } from "@/schemas/quotations/createQuotationSchema";
import {
    Floor,
    HeadQuotation as HeadQuotationType,
    Costs,
    QuotationStructure,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { CreateClientDialog } from "@/components/clients/CreateClientDialog";
import { HeadQuotation } from "@/components/quotation/create-quotation/create-head-quotation/HeadQuotation";
import IntegralProject from "@/components/quotation/create-quotation/create-integral-project/IntegralProject";
import {
    CreateLevelSpace,
    extractData,
} from "@/components/quotation/create-quotation/create-level-space/LevelSpaceCreate";
import CreateQuotationButton from "@/components/quotation/CreateQuotationButton";
import {
    projectNames,
    projects,
} from "@/components/quotation/IntegralProjectData";
import { CreateSpaceDialog } from "@/components/spaces/CreateSpaceDialog";
import { Form } from "@/components/ui/form";
import { CreateZoningDialog } from "@/components/zoning/CreateZoningDialog";

export default function CreateQuotation() {
    const [floors, setFloors] = useState<Floor[]>([
        { number: 1, name: "Nivel 1", spaces: [], expanded: true },
    ]);

    // Estados para IntegralProject
    const [costs, setCosts] = useState<Costs>({
        architecturalCost: 0,
        structuralCost: 0,
        electricCost: 0,
        sanitaryCost: 0,
    });
    const [discount, setDiscount] = useState(0);
    const { exchangeRate: fetchedExchangeRate } = useExchangeRate();

    const [exchangeRate, setExchangeRate] = useState(
        fetchedExchangeRate ? parseFloat(fetchedExchangeRate) : 3.5,
    );

    useEffect(() => {
        if (fetchedExchangeRate !== undefined) {
            setExchangeRate(parseFloat(fetchedExchangeRate));
        }
    }, [fetchedExchangeRate]);
    const [totalCost, setTotalCost] = useState(0);

    const calculateTotalBuildingMeters = React.useCallback(() => {
        return floors.reduce(
            (total, floor) =>
                total +
                floor.spaces.reduce((sum, space) => sum + space.meters, 0),
            0,
        );
    }, [floors]);

    // Calcular totalCost y subtotal en base a area
    useEffect(() => {
        const totalWithDiscount = discount * exchangeRate;
        setTotalCost(totalWithDiscount);
    }, [costs, discount, exchangeRate, floors, calculateTotalBuildingMeters]);

    const obtenerHeadQuotation = (): HeadQuotationType => {
        return {
            name: form.getValues("name"),
            description: form.getValues("description"),
            deliveryTime: form.getValues("deliveryTime"),
            landArea: form.getValues("landArea"),
            idClient: form.getValues("clientId"),
            idZoning: form.getValues("zoningId"),
        };
    };

    const getAllDataIntegralProject = () => {
        const area = calculateTotalBuildingMeters();
        return {
            exchangeRate,
            discount,
            totalCost,
            area,
            projects: Object.entries(projects).map(
                ([nombreProyecto, items]) => ({
                    nombreProyecto,
                    items,
                    area,
                    cost: costs[
                        Object.keys(projectNames).find(
                            (key) =>
                                projectNames[key as keyof Costs] ===
                                nombreProyecto,
                        ) as keyof Costs
                    ],
                }),
            ),
        };
    };

    const form = useForm<QuotationStructure>({
        resolver: zodResolver(createQuotationSchema),
        defaultValues: {
            name: "",
            description: "",
            clientId: "",
            deliveryTime: 1,
            landArea: 1,
            code: "",
            discount: 0,
            exchangeRate: fetchedExchangeRate
                ? parseFloat(fetchedExchangeRate)
                : undefined,
            paymentSchedule: [],
            architecturalCost: 0,
            structuralCost: 0,
            electricCost: 0,
            sanitaryCost: 0,
        },
    });

    const onSubmit = () => {};

    const diferentPage = true;

    return (
        <>
            <div className="flex flex-col gap-6 sm:flex-row">
                <CreateClientDialog diferentPage={diferentPage} />
                <CreateSpaceDialog diferentPage={diferentPage} />
                <CreateZoningDialog diferentPage={diferentPage} />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 p-1"
                >
                    <HeadQuotation form={form} />
                    <CreateLevelSpace
                        floors={floors}
                        setFloors={setFloors}
                        calculateTotalBuildingMeters={
                            calculateTotalBuildingMeters
                        }
                        form={form}
                    />
                    <IntegralProject
                        area={calculateTotalBuildingMeters()}
                        costs={costs}
                        setCosts={setCosts}
                        discount={discount}
                        setDiscount={setDiscount}
                        exchangeRate={exchangeRate}
                        setExchangeRate={setExchangeRate}
                        form={form}
                        setTotalCost={setTotalCost}
                    />
                </form>
            </Form>
            <CreateQuotationButton
                extractData={() => extractData(floors)}
                obtenerHeadQuotation={obtenerHeadQuotation}
                getAllDataIntegralProject={getAllDataIntegralProject}
                form={form}
            />
        </>
    );
}
