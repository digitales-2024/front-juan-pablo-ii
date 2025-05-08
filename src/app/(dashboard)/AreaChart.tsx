"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Calendar } from "lucide-react";
import { useKPI } from "./_hooks/useKPI";


// Configuración para el gráfico con nombres de sucursales
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

export function KPIAreaChart() {
  // Hook personalizado para obtener los datos
  const { useCitasPorSucursal } = useKPI();

  // Obtener datos, estado de carga y errores
  const { data: chartData, isLoading, error } = useCitasPorSucursal();

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <CardTitle>
          <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Citas por sucursal
          </h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[250px] text-red-500">
            Error al cargar datos: {error.message}
          </div>
        ) : !chartData || chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            No hay datos disponibles
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillJLBYR" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-JLBYR)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-JLBYR)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillYanahuara" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-Yanahuara)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-Yanahuara)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16} // Reducido para mostrar más etiquetas
                interval="preserveStartEnd" // Asegura que se muestren el primer y último mes
                tickFormatter={(month: string) => month.substring(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="Yanahuara"
                type="monotone"
                fill="url(#fillYanahuara)"
                stroke="var(--color-Yanahuara)"
                stackId="a"
              />
              <Area
                dataKey="JLBYR"
                type="monotone"
                fill="url(#fillJLBYR)"
                stroke="var(--color-JLBYR)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
