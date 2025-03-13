"use client";

import { useState, useEffect } from "react";
import LayoutAdmin from "./(admin)/layout";
import { KPIBarChart } from "./(dashboard)/BarChart";
import { KPILineChartMultiple } from "./(dashboard)/LineChart";
import { KPIBarChartStacked } from "./(dashboard)/BarChartStacked";
import {
  CalendarIcon,
  Users,
  Calendar,
  AlertTriangle,
  DollarSign,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { KPICard } from "./(dashboard)/CardChart";
import { KPIBarChartCustom } from "./(dashboard)/BarChartCustom";
import { KPIAreaChart } from "./(dashboard)/AreaChart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useKPI } from "./(dashboard)/_hooks/useKPI";

export default function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Obtener datos para los KPI Cards
  const { data: kpiData, isLoading: kpiLoading, refetch } = useKPI().useKpiCardsData();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      setCurrentDateTime(now.toLocaleDateString("es-ES", options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Actualiza cada minuto

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    // Refrescar los datos usando la función de refetch proporcionada por useQuery
    refetch().then(() => {
      setIsRefreshing(false);
    }).catch(() => {
      setIsRefreshing(false);
    });
  };

  // Formateo de valores para mostrar en los KPI Cards
  const formatCurrency = (value: number) => {
    return `S/ ${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('es-PE');
  };

  return (
    <LayoutAdmin>
      <div className="flex flex-col w-full gap-4 p-4 md:p-6 bg-gray-50/50">
        {/* Header con título y botón de actualización */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Inicio general del sistema
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-1 w-full sm:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
            <div className="flex items-center gap-2 bg-blue-50 rounded-md border border-blue-100 p-2 text-sm w-full sm:w-auto justify-center">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="font-medium text-gray-700">
                {currentDateTime}
              </span>
            </div>
          </div>
        </div>

        {/* Sección de KPI Cards */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Resumen
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {kpiLoading ? (
              // Mostrar placeholders durante la carga
              <>
                {[...Array.from({ length: 5 })].map((_, i) => (
                  <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </>
            ) : (
              // Mostrar KPI Cards con datos reales
              <>
                <Link
                  href="/orders"
                  className="block transition-transform hover:scale-105"
                >
                  <KPICard
                    title="Total Ingresos por mes"
                    value={formatCurrency(kpiData?.totalIngresos ?? 0)}
                    description="Total de ingresos del mes"
                    icon={<DollarSign className="h-5 w-5 text-green-600" />}
                    className="shadow-md hover:shadow-lg border-l-4 border-l-green-500"
                  />
                </Link>
                <Link
                  href="/patient"
                  className="block transition-transform hover:scale-105"
                >
                  <KPICard
                    title="Total de Pacientes"
                    value={formatNumber(kpiData?.totalPacientes ?? 0)}
                    description="Total de pacientes registrados"
                    icon={<Users className="h-5 w-5 text-blue-600" />}
                    className="shadow-md hover:shadow-lg border-l-4 border-l-blue-500"
                  />
                </Link>
                <Link
                  href="/appointments"
                  className="block transition-transform hover:scale-105"
                >
                  <KPICard
                    title="Citas completadas"
                    value={formatNumber(kpiData?.citasCompletadas ?? 0)}
                    description="Total de citas completadas"
                    icon={<Calendar className="h-5 w-5 text-indigo-600" />}
                    className="shadow-md hover:shadow-lg border-l-4 border-l-indigo-500"
                  />
                </Link>
                <Link
                  href="/appointments-schedule"
                  className="block transition-transform hover:scale-105"
                >
                  <KPICard
                    title="Citas pendientes"
                    value={formatNumber(kpiData?.citasPendientes ?? 0)}
                    description="Citas pendientes"
                    icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
                    className="shadow-md hover:shadow-lg border-l-4 border-l-amber-500"
                  />
                </Link>
                <Link
                  href="/orders"
                  className="block transition-transform hover:scale-105"
                >
                  <KPICard
                    title="Ingreso promedio por día"
                    value={formatCurrency(kpiData?.ingresoPromedio ?? 0)}
                    description="Ingreso promedio"
                    icon={<DollarSign className="h-5 w-5 text-purple-600" />}
                    className="shadow-md hover:shadow-lg border-l-4 border-l-purple-500"
                  />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Sección de gráficos principales y secundarios */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Columna izquierda - Gráficos principales (66%) */}
          <div className="lg:col-span-3 grid grid-cols-1 gap-4">
            {/* Gráfico de barras - Ingresos generales */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <KPIBarChart />
            </div>

            {/* Gráfico de líneas - Nuevos pacientes */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <KPILineChartMultiple />
            </div>
          </div>

          {/* Columna derecha - Gráficos secundarios (33%) */}
          <div className="lg:col-span-1 grid grid-cols-1 gap-4 h-full">
            {/* Gráfico de barras customizadas - Servicios más demandados */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 h-1/2">
              <KPIBarChartCustom />
            </div>

            {/* Gráfico de barras apiladas - Comparativa por área */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 h-1/2">
              <KPIBarChartStacked />
            </div>
          </div>
        </div>

        {/* Componente a ancho completo - Gráfico de área */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-full">
          <KPIAreaChart />
        </div>
      </div>
    </LayoutAdmin>
  );
}
