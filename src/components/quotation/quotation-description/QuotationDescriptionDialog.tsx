import { useMediaQuery } from "@/hooks/use-media-query";
import { useQuotations } from "@/hooks/use-quotation";
import { QuotationStatusType, QuotationSummary } from "@/types";
import {
    DollarSign,
    Layout,
    Calendar,
    Building,
    Info,
    Grid2X2,
} from "lucide-react";
import React from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../ui/accordion";
import { Badge } from "../../ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../../ui/drawer";
import { ScrollArea } from "../../ui/scroll-area";
import CostQuotationDescription from "./CostQuotationDescription";
import FooterQuotationDescription from "./FooterQuotationDescription";
import HeadQuotationDescription from "./HeadQuotationDescription";
import IntegralProjectQuotationDescription from "./IntegralProjectQuotationDescription";
import LevelsQuotationDescription from "./LevelsQuotationDescription";
import PaymentScheduleQuotationDescription from "./PaymentScheduleQuotationDescription";
import ZoningQuotationDescription from "./ZoningQuotationDescription";

interface QuotationDescriptionDialogProps {
    quotation: QuotationSummary;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function QuotationDescriptionDialog({
    quotation,
    open,
    onOpenChange,
}: QuotationDescriptionDialogProps) {
    const { quotationById } = useQuotations({ id: quotation.id });
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    // Definimos los componentes según el dispositivo
    const Container = isDesktop ? Dialog : Drawer;
    const ContentComponent = isDesktop ? DialogContent : DrawerContent;
    const Header = isDesktop ? DialogHeader : DrawerHeader;
    const Title = isDesktop ? DialogTitle : DrawerTitle;
    const Description = isDesktop ? DialogDescription : DrawerDescription;
    const Footer = isDesktop ? DialogFooter : DrawerFooter;

    return (
        <Container open={open} onOpenChange={onOpenChange}>
            <ContentComponent className="w-full max-w-5xl p-4">
                <Header className="text-left">
                    <div>
                        <Title className="flex flex-col items-start">
                            Detalles de la Cotización
                        </Title>
                        <div className="mt-2">
                            {quotationById?.status ===
                            QuotationStatusType.APPROVED ? (
                                <Badge
                                    variant="secondary"
                                    className="bg-emerald-100 text-emerald-500"
                                >
                                    Aprobado
                                </Badge>
                            ) : quotationById?.status ===
                              QuotationStatusType.PENDING ? (
                                <Badge
                                    variant="secondary"
                                    className="bg-yellow-100 text-yellow-500"
                                >
                                    Pendiente
                                </Badge>
                            ) : quotationById?.status ===
                              QuotationStatusType.REJECTED ? (
                                <Badge
                                    variant="secondary"
                                    className="bg-red-100 text-red-500"
                                >
                                    Rechazado
                                </Badge>
                            ) : (
                                <Badge
                                    variant="secondary"
                                    className="bg-gray-100 text-gray-500"
                                >
                                    Desconocido
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div>
                        <Description>
                            Información detallada de la cotización{" "}
                            <span
                                className={`${
                                    quotationById?.status ===
                                    QuotationStatusType.APPROVED
                                        ? "text-emerald-500"
                                        : quotationById?.status ===
                                            QuotationStatusType.PENDING
                                          ? "text-yellow-500"
                                          : quotationById?.status ===
                                              QuotationStatusType.REJECTED
                                            ? "text-red-500"
                                            : ""
                                } font-light italic`}
                            >
                                COT-DIS-{quotationById?.publicCode}
                            </span>
                        </Description>
                    </div>
                </Header>
                <ScrollArea
                    className={`${isDesktop ? "h-[80vh]" : "h-[60vh]"} gap-4 p-4`}
                >
                    <Accordion type="multiple" className="mb-6">
                        <AccordionItem value="info-general">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Info
                                        className="mr-2 h-6 w-6"
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-base font-light">
                                        Información General
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {quotationById && (
                                    <HeadQuotationDescription
                                        quotationById={quotationById}
                                    />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="zoning">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Grid2X2
                                        className="mr-2 h-6 w-6"
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-base font-light">
                                        Detalles de la Zonificación
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ZoningQuotationDescription
                                    id={quotationById?.zoning.id ?? ""}
                                />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="costos-presupuestos">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <DollarSign
                                        className="mr-2 h-6 w-6"
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-base font-light">
                                        Costos y Presupuestos
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {quotationById && (
                                    <CostQuotationDescription
                                        quotationById={quotationById}
                                    />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="detalles-proyecto">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Layout
                                        className="mr-2 h-6 w-6"
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-base font-light">
                                        Detalles Integrales del Proyecto
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-4 p-4 md:grid-cols-2">
                                    {Array.isArray(
                                        quotationById?.integratedProjectDetails,
                                    ) &&
                                        quotationById?.integratedProjectDetails.map(
                                            (subproyecto, index) => (
                                                <IntegralProjectQuotationDescription
                                                    key={index}
                                                    {...subproyecto}
                                                />
                                            ),
                                        )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="cronograma-pagos">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Calendar
                                        className="mr-2 h-6 w-6"
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-base font-light">
                                        Cronograma de Pagos
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="mb-6 grid gap-4 p-4 md:grid-cols-3">
                                    {Array.isArray(
                                        quotationById?.paymentSchedule,
                                    ) &&
                                        quotationById?.paymentSchedule.map(
                                            (fase, index) => (
                                                <PaymentScheduleQuotationDescription
                                                    key={index}
                                                    {...fase}
                                                />
                                            ),
                                        )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="levels-spaces">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Building
                                        className="mr-2 h-6 w-6"
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-base font-light">
                                        Detalles de los Niveles y Ambientes
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <LevelsQuotationDescription
                                    levelData={quotationById?.levels ?? []}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <div className="items-end">
                        <Footer>
                            {quotationById && (
                                <FooterQuotationDescription
                                    quotationById={quotationById}
                                />
                            )}
                        </Footer>
                    </div>
                </ScrollArea>
            </ContentComponent>
        </Container>
    );
}
