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
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { KPICard } from "./(dashboard)/CardChart";
import { KPIBarChartCustom } from "./(dashboard)/BarChartCustom";
import { KPIAreaChart } from "./(dashboard)/AreaChart";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    // Simular actualización de datos
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <LayoutAdmin>
      <div className="flex flex-col w-full gap-6 p-6 bg-gray-50/50">
        {/* Header con mejoras */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Vista general del sistema
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
            <div className="flex items-center gap-2 bg-blue-50 rounded-md border border-blue-100 p-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="font-medium text-gray-700">
                {currentDateTime}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs con mejoras visuales */}
        <div className="flex gap-2 border-b bg-white rounded-t-xl p-2 pt-4 px-4 shadow-sm">
          <button
            className={`px-6 py-2 rounded-md transition-all flex items-center gap-2
              ${
                activeTab === "resumen"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab("resumen")}
          >
            <BarChart3 className="h-4 w-4" />
            Resumen
          </button>
          <button
            className={`px-6 py-2 rounded-md transition-all flex items-center gap-2
              ${
                activeTab === "analiticas"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab("analiticas")}
          >
            <LineChart className="h-4 w-4" />
            Analíticas
          </button>
        </div>

        {/* Sección de KPI Cards */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Indicadores principales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link
              href="/ingresos"
              className="block transition-transform hover:scale-105"
            >
              <KPICard
                title="Total Ingresos"
                value="S/ 5,231.89"
                description="Total de ingresos del mes"
                icon={<DollarSign className="h-5 w-5 text-green-600" />}
                className="shadow-md hover:shadow-lg border-l-4 border-l-green-500"
              />
            </Link>
            <Link
              href="/clientes"
              className="block transition-transform hover:scale-105"
            >
              <KPICard
                title="Clientes"
                value="235"
                description="Total de clientes atendidos"
                icon={<Users className="h-5 w-5 text-blue-600" />}
                className="shadow-md hover:shadow-lg border-l-4 border-l-blue-500"
              />
            </Link>
            <Link
              href="/citas"
              className="block transition-transform hover:scale-105"
            >
              <KPICard
                title="Citas"
                value="124"
                description="Total de citas atendidas"
                icon={<Calendar className="h-5 w-5 text-indigo-600" />}
                className="shadow-md hover:shadow-lg border-l-4 border-l-indigo-500"
              />
            </Link>
            <Link
              href="/citas-pendientes"
              className="block transition-transform hover:scale-105"
            >
              <KPICard
                title="Citas pendientes"
                value="15"
                description="Citas pendientes el día de hoy"
                icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
                className="shadow-md hover:shadow-lg border-l-4 border-l-amber-500"
              />
            </Link>
            <Link
              href="/ingresos-promedio"
              className="block transition-transform hover:scale-105"
            >
              <KPICard
                title="Ingreso promedio"
                value="S/ 98.50"
                description="Ingreso promedio por médico"
                icon={<DollarSign className="h-5 w-5 text-purple-600" />}
                className="shadow-md hover:shadow-lg border-l-4 border-l-purple-500"
              />
            </Link>
          </div>
        </div>

        {activeTab === "resumen" ? (
          <>
            {/* Gráficos con títulos descriptivos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
              {/* Columna izquierda - 2/3 del ancho */}
              <div className="lg:col-span-2 h-full">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                  <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Ingresos por mes
                  </h3>
                  <div className="flex-grow">
                    <KPIBarChart />
                  </div>
                </div>
              </div>

              {/* Columna derecha - 1/3 del ancho */}
              <div className="h-full">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                  <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-primary" />
                    Distribución por servicio
                  </h3>
                  <div className="flex-grow">
                    <KPIBarChartCustom />
                  </div>
                </div>
              </div>
            </div>

            {/* Segunda fila de gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
              {/* Columna izquierda - 2/3 del ancho */}
              <div className="lg:col-span-2 h-full">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                  <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-primary" />
                    Tendencias anuales
                  </h3>
                  <div className="flex-grow">
                    <KPILineChartMultiple />
                  </div>
                </div>
              </div>

              {/* Columna derecha - 1/3 del ancho */}
              <div className="h-full">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                  <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Comparativa por área
                  </h3>
                  <div className="flex-grow">
                    <KPIBarChartStacked />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Misma estructura para la pestaña de analíticas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
              <div className="lg:col-span-2 h-full">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                  <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Análisis detallado
                  </h3>
                  <div className="flex-grow">
                    <KPIBarChart />
                  </div>
                </div>
              </div>
              <div className="h-full">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                  <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-primary" />
                    Segmentación de clientes
                  </h3>
                  <div className="flex-grow">
                    <KPIBarChartCustom />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
              <div className="lg:col-span-2 h-full">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                  <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-primary" />
                    Rendimiento histórico
                  </h3>
                  <div className="flex-grow">
                    <KPILineChartMultiple />
                  </div>
                </div>
              </div>
              <div className="h-full">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                  <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Comparativa de servicios
                  </h3>
                  <div className="flex-grow">
                    <KPIBarChartStacked />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Componente a ancho completo al pie */}
      <div className="w-full px-6 pb-6 bg-gray-50/50">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 w-full">
          <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Tendencias a lo largo del tiempo
          </h3>
          <KPIAreaChart />
        </div>
      </div>
    </LayoutAdmin>
  );
}
