"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart } from "lucide-react";
import { useKPI } from "./_hooks/useKPI";

// Configuración para el gráfico
const chartConfig = {
  pagadas: {
    label: "Pagadas",
    color: "hsl(var(--chart-1))",
  },
  pendientes: {
    label: "Pendientes",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

// Datos de ejemplo por si no hay datos reales
const fallbackData = [
  { month: "Enero", pagadas: 45, pendientes: 15 },
  { month: "Febrero", pagadas: 52, pendientes: 22 },
  { month: "Marzo", pagadas: 61, pendientes: 18 },
  { month: "Abril", pagadas: 48, pendientes: 25 },
  { month: "Mayo", pagadas: 55, pendientes: 20 },
  { month: "Junio", pagadas: 67, pendientes: 15 },
  { month: "Julio", pagadas: 72, pendientes: 8 },
  { month: "Agosto", pagadas: 58, pendientes: 12 },
  { month: "Septiembre", pagadas: 63, pendientes: 17 },
  { month: "Octubre", pagadas: 68, pendientes: 14 },
  { month: "Noviembre", pagadas: 75, pendientes: 10 },
  { month: "Diciembre", pagadas: 81, pendientes: 9 },
];

//indicador para cotizaciones pagadas vs pendientes
export function KPIBarChartCustom() {
  // Hook personalizado para obtener los datos
  const { useCotizacionesPorEstado } = useKPI();

  // Obtener datos, estado de carga y errores
  const { data: cotizacionesData, isLoading, error } = useCotizacionesPorEstado();

  // Procesar los datos para manejar valores cero
  const chartData = (cotizacionesData && cotizacionesData.length > 0 ? cotizacionesData : fallbackData)
    .map(item => ({
      ...item,
      // Convertir ceros a un valor pequeño para que se vean como líneas
      pagadas: item.pagadas === 0 ? 0.5 : item.pagadas,
      pendientes: item.pendientes === 0 ? 0.5 : item.pendientes,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary" />
            Cotizaciones pagadas vs pendientes
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
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 30,
                left: 10,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) => value.slice(0, 3)}
              />
              <XAxis 
                type="number" 
                domain={[0, 'auto']} 
                hide 
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="pagadas"
                layout="vertical"
                fill="var(--color-pagadas)"
                radius={4}
                name="Pagadas"
              >
                <LabelList
                  /* dataKey="month" */
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="pagadas"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => value < 1 ? "0" : value}
                />
              </Bar>
              <Bar
                dataKey="pendientes"
                layout="vertical"
                fill="var(--color-pendientes)"
                radius={4}
                name="Pendientes"
                stackId="a"
              >
                <LabelList
                  dataKey="pendientes"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => value < 1 ? "0" : value}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}