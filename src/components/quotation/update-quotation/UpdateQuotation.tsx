"use client";

import { useQuotations } from "@/hooks/use-quotation";
import { updateQuotationSchema, UpdateQuotationSchema } from "@/schemas";
import { Floor, PaymentSchedule, Quotation, QuotationStructure } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";

import { CreateClientDialog } from "@/components/clients/CreateClientDialog";
import { HeadQuotation } from "@/components/quotation/create-quotation/create-head-quotation/HeadQuotation";
import {
    CreateLevelSpace,
    extractData,
} from "@/components/quotation/create-quotation/create-level-space/LevelSpaceCreate";
import { CreateSpaceDialog } from "@/components/spaces/CreateSpaceDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreateZoningDialog } from "@/components/zoning/CreateZoningDialog";

import IntegralProject from "../create-quotation/create-integral-project/IntegralProject";
import { projects } from "../IntegralProjectData";

interface UpdateQuotationProps {
    quotationById: Quotation;
}

export default function UpdateQuotation({
    quotationById,
}: UpdateQuotationProps) {
    const {
        onUpdateQuotation,
        isSuccessUpdateQuotation,
        isLoadingUpdateQuotation,
    } = useQuotations();

    const [floors, setFloors] = useState<Floor[]>([]);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isSuccessUpdateQuotation && isClient) {
            router.push("/design-project/quotation");
        }
    }, [isSuccessUpdateQuotation, isClient, router]);

    // Inicializa el formulario con valores vacíos
    const form = useForm<UpdateQuotationSchema>({
        resolver: zodResolver(updateQuotationSchema),
        defaultValues: {
            name: "",
            clientId: "",
            zoningId: "",
            deliveryTime: 0,
            landArea: 0,
            description: "",
            architecturalCost: 0,
            structuralCost: 0,
            electricCost: 0,
            sanitaryCost: 0,
            discount: 0,
            exchangeRate: 0,
            totalAmount: 0,
        },
    });

    // Actualiza el formulario y los pisos cuando los datos de la cotización estén disponibles
    useEffect(() => {
        if (quotationById) {
            const adaptedLevelData = quotationById.levels.map(
                (level, index) => ({
                    number: index,
                    name: level.name,

                    spaces: level.spaces.map((space) => ({
                        spaceId: space.id ?? "",
                        name: space.name ?? "",
                        meters: space.area,
                        amount: space.amount,
                        selected: false,
                    })),
                    expanded: false,
                }),
            );
            setFloors(adaptedLevelData);

            form.reset({
                name: quotationById.name,
                clientId: quotationById.client.id.toString(),
                zoningId: quotationById.zoning.id.toString(),
                deliveryTime: quotationById.deliveryTime,
                landArea: quotationById.landArea,
                description: quotationById.description,
                architecturalCost: quotationById.architecturalCost,
                structuralCost: quotationById.structuralCost,
                electricCost: quotationById.electricCost,
                sanitaryCost: quotationById.sanitaryCost,
                discount: quotationById.discount,
                exchangeRate: quotationById.exchangeRate,
                totalAmount: quotationById.totalAmount,
            });
        }
    }, [quotationById, form]);

    const architecturalCost = form.watch("architecturalCost").toString();
    const structuralCost = form.watch("structuralCost").toString();
    const electricCost = form.watch("electricCost").toString();
    const sanitaryCost = form.watch("sanitaryCost").toString();
    const discount = form.watch("discount").toString();

    useEffect(() => {}, [
        architecturalCost,
        structuralCost,
        electricCost,
        sanitaryCost,
        discount,
        form,
        quotationById?.metering,
    ]);

    const calculateTotalMeters = (floor: Floor) => {
        return floor.spaces.reduce((total, space) => total + space.meters, 0);
    };

    const calculateTotalBuildingMeters = () => {
        return floors.reduce(
            (total, floor) => total + calculateTotalMeters(floor),
            0,
        );
    };

    const onSubmit = async (input: UpdateQuotationSchema) => {
        const levelsData = extractData(floors);
        const metering = calculateTotalBuildingMeters();
        const architecturalCost = input.architecturalCost;
        const structuralCost = input.structuralCost;
        const electricCost = input.electricCost;
        const sanitaryCost = input.sanitaryCost;

        const totalCost = input.totalAmount;

        const paymentSchedule: PaymentSchedule[] = [
            {
                name: "INICIAL FIRMA DE CONTRATO",
                percentage: 30,
                cost: (totalCost * 30) / 100,
                description: "INICIO DE DISEÑO ",
            },
            {
                name: "APROBACION DEL ANTEPROYECTO",
                percentage: 50,
                cost: (totalCost * 50) / 100,
                description:
                    "APROBACIÓN PROPIETARIO DE DISEÑO PARA INICIAR INGENIERÍA",
            },
            {
                name: "ENTREGA DE EXPEDIENTE TECNICO",
                percentage: 20,
                cost: (totalCost * 20) / 100,
                description: "TRAMITE DE OBTENCIÓN DE LICENCIA",
            },
        ];

        const integralProjectsDetails = Object.entries(projects).map(
            ([nombreProyecto, items]) => {
                const costMap: { [key: string]: number } = {
                    "Proyecto Arquitectónico": input.architecturalCost,
                    "Proyecto Estructural": input.structuralCost,
                    "Proyecto de Instalaciones Eléctricas": input.electricCost,
                    "Proyecto de Instalaciones Sanitarias": input.sanitaryCost,
                };

                return {
                    project: nombreProyecto,
                    items,
                    metering,
                    area: metering,
                    cost: costMap[nombreProyecto] || 0,
                };
            },
        );

        const quotationUpdated: QuotationStructure = {
            name: input.name,
            description: input.description,
            discount: input.discount,
            deliveryTime: input.deliveryTime,
            exchangeRate: input.exchangeRate,
            landArea: input.landArea,
            paymentSchedule: paymentSchedule,
            integratedProjectDetails: integralProjectsDetails,
            architecturalCost: architecturalCost,
            structuralCost: structuralCost,
            electricCost: electricCost,
            sanitaryCost: sanitaryCost,
            metering: metering,
            levels: levelsData,
            clientId: input.clientId,
            zoningId: input.zoningId,
            totalAmount: totalCost,
        };

        onUpdateQuotation({
            ...quotationUpdated,
            id: quotationById?.id ?? "",
        });
    };

    const handleBack = () => {
        if (isClient) {
            router.push("/design-project/quotation");
        }
    };

    useEffect(() => {
        if (isSuccessUpdateQuotation) {
            form.reset();
        }
    }, [isSuccessUpdateQuotation, form]);

    const diferentPage = true;
    return (
        <>
            <div className="flex flex-col gap-6 sm:flex-row">
                <CreateClientDialog diferentPage={diferentPage} />
                <CreateSpaceDialog diferentPage={diferentPage} />
                <CreateZoningDialog diferentPage={diferentPage} />
            </div>
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 p-4"
                >
                    <HeadQuotation
                        form={form as UseFormReturn<QuotationStructure>}
                        clientIdUpdate={quotationById?.client.id.toString()}
                    />

                    <Separator className="my-4" />
                    <CreateLevelSpace
                        form={form as UseFormReturn<QuotationStructure>}
                        floors={floors}
                        setFloors={setFloors}
                        calculateTotalBuildingMeters={
                            calculateTotalBuildingMeters
                        }
                    />
                    <Separator className="my-4" />

                    <IntegralProject
                        form={form as UseFormReturn<QuotationStructure>}
                        area={calculateTotalBuildingMeters()}
                        costs={{
                            architecturalCost: parseFloat(architecturalCost),
                            structuralCost: parseFloat(structuralCost),
                            electricCost: parseFloat(electricCost),
                            sanitaryCost: parseFloat(sanitaryCost),
                        }}
                        setCosts={(costs) => ({
                            ...costs,
                            architecturalCost: parseFloat(architecturalCost),
                            structuralCost: parseFloat(structuralCost),
                            electricCost: parseFloat(electricCost),
                            sanitaryCost: parseFloat(sanitaryCost),
                        })}
                        discount={parseFloat(discount)}
                        exchangeRate={form.watch("exchangeRate")}
                        setDiscount={(discount) => discount}
                        setExchangeRate={(exchangeRate) => exchangeRate}
                        setTotalCost={(totalCost) => totalCost}
                        updateQuotation={quotationById.totalAmount}
                    />
                    <Separator className="my-4" />

                    <div className="flex flex-row-reverse gap-2 pt-2">
                        <Button
                            type="submit"
                            disabled={isLoadingUpdateQuotation}
                        >
                            {isLoadingUpdateQuotation && (
                                <RefreshCcw
                                    className="mr-2 h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                            )}
                            Actualizar
                        </Button>
                        <Button
                            type="button"
                            variant={"destructive"}
                            onClick={handleBack}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
}
