"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart3 } from "lucide-react";
import { useKPI } from "./_hooks/useKPI";

// Configuración para el gráfico
const chartConfig = {
  JLBYR: {
    label: "JLBYR",
    color: "hsl(var(--chart-1))",
  },
  Yanahuara: {
    label: "Yanahuara",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Datos de ejemplo por si no hay datos reales
const fallbackData = [
  { serviceName: "Servicio1", JLBYR: 186, Yanahuara: 80 },
  { serviceName: "Servicio2", JLBYR: 305, Yanahuara: 200 },
  { serviceName: "Servicio3", JLBYR: 237, Yanahuara: 120 },
  { serviceName: "Servicio4", JLBYR: 73, Yanahuara: 190 },
  { serviceName: "Servicio5", JLBYR: 209, Yanahuara: 130 },
  { serviceName: "Servicio6", JLBYR: 214, Yanahuara: 140 },
  { serviceName: "Servicio7", JLBYR: 186, Yanahuara: 80 },
  { serviceName: "Servicio8", JLBYR: 305, Yanahuara: 200 },
  { serviceName: "Servicio9", JLBYR: 237, Yanahuara: 120 },
  { serviceName: "Servicio10", JLBYR: 73, Yanahuara: 190 },
  { serviceName: "Servicio11", JLBYR: 209, Yanahuara: 130 },
  { serviceName: "Servicio12", JLBYR: 214, Yanahuara: 140 },
];

export function KPIBarChartStacked() {
  // Hook personalizado para obtener los datos
  const { useTopServicesPorSucursal } = useKPI();

  // Obtener datos, estado de carga y errores
  const { data: serviciosData, isLoading, error } = useTopServicesPorSucursal();

  // Definir qué datos mostrar (reales o fallback)
  const chartData = serviciosData && serviciosData.length > 0 ? serviciosData : fallbackData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Top servicios mas demandados por sucursal
          </h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-red-500">
            Error al cargar datos: {error.message}
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="serviceName"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) => value.slice(0, 7)}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="JLBYR"
                stackId="a"
                fill="var(--color-JLBYR)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="Yanahuara"
                stackId="a"
                fill="var(--color-Yanahuara)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}