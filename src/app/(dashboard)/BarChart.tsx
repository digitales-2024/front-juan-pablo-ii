"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useKPI } from "./_hooks/useKPI";

export function KPIBarChart() {
  const { useIngresosPorSucursal } = useKPI();

  // Obtener datos, estado de carga y errores
  const { data, isLoading, error } = useIngresosPorSucursal();

  // Inicializar chartConfig dinámicamente con los nombres de las sucursales
  const [chartConfig, setChartConfig] = React.useState<ChartConfig>({
    views: { label: "Ingresos" },
  });

  // Estado para la sucursal activa
  const [activeSucursal, setActiveSucursal] = React.useState<string>("");

  // Actualizar la configuración cuando se cargan los datos
  React.useEffect(() => {
    if (data?.sucursales) {
      const config: ChartConfig = {
        views: { label: "Ingresos" },
      };

      // Generar colores para cada sucursal
      const colorVariables = [
        "--chart-1",
        "--chart-2",
        "--chart-3",
        "--chart-4",
        "--chart-5",
      ];

      data.sucursales.forEach((sucursal, index) => {
        config[sucursal] = {
          label: sucursal,
          color: `hsl(var(${colorVariables[index % colorVariables.length]}))`,
        };
      });

      setChartConfig(config);

      // Establecer la primera sucursal como activa por defecto
      if (data.sucursales.length > 0 && !activeSucursal) {
        setActiveSucursal(data.sucursales[0]);
      }
    }
  }, [data, activeSucursal]);

  // Calcular el total de ingresos por sucursal
  const totales = React.useMemo(() => {
    if (!data?.ingresos || data.ingresos.length === 0) return {};

    const totales: Record<string, number> = {};

    data.ingresos.forEach((registro) => {
      Object.entries(registro).forEach(([key, value]) => {
        if (key !== "date" && typeof value === "number") {
          if (!totales[key]) totales[key] = 0;
          totales[key] += value;
        }
      });
    });

    return totales;
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Ingresos trimestrales</CardTitle>
          <CardDescription>
            Total de ingresos por sucursal de los últimos 3 meses
          </CardDescription>
        </div>
            <div className="flex">
          {data?.sucursales?.map((sucursal) => (
            <button
              key={sucursal}
              data-active={activeSucursal === sucursal}
              className="relative z-30 flex flex-1 flex-col justify-center gap-0.5 border-t px-4 py-3 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-6 sm:py-4"
              onClick={() => setActiveSucursal(sucursal)}
            >
              <span className="text-lg font-bold leading-none sm:text-2xl">
                {sucursal}
              </span>
              <span className="text-xs text-muted-foreground">
                S/ {totales[sucursal]?.toLocaleString() || 0}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[250px] text-red-500">
            Error al cargar datos: {error.message}
          </div>
        ) : !data?.ingresos?.length ? (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            No hay datos disponibles
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={data.ingresos}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string | number) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                      labelFormatter={(value: string | number) => {
                      return new Date(value).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    formatter={(value) => [`S/ ${String(value)}`, activeSucursal]}
                  />
                }
              />
              <Bar
                dataKey={activeSucursal}
                fill={`var(--color-${activeSucursal.replace(/\s+/g, "-")})`}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
