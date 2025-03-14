"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Legend,
 /*  ResponsiveContainer, */
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { useKPI } from "./_hooks/useKPI";
import { useState } from "react";

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

export function KPILineChartMultiple() {
  // Opcional: estado para el año que se quiere visualizar
  const [selectedYear/* , setSelectedYear */] = useState<number>(
    new Date().getFullYear()
  );

  // Hook personalizado para obtener los datos
  const { usePacientesPorSucursal } = useKPI();

  // Obtener datos, estado de carga y errores
  const {
    data: chartData,
    isLoading,
    error,
  } = usePacientesPorSucursal(selectedYear);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Pacientes registrados por mes
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
        ) : !chartData || chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No hay datos disponibles
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                name="JLBYR"
                dataKey="JLBYR"
                type="monotone"
                stroke="var(--color-JLBYR)"
                strokeWidth={2}
                dot={true}
                activeDot={{ r: 6 }}
              />
              <Line
                name="Yanahuara"
                dataKey="Yanahuara"
                type="monotone"
                stroke="var(--color-Yanahuara)"
                strokeWidth={2}
                dot={true}
                activeDot={{ r: 6 }}
              />
              <Legend />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
