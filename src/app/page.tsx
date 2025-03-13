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
  ClipboardList,
  UserCheck,

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
  
  // Obtener datos para los KPI Cards y el rol del usuario
  const { 
    useKpiCardsData, 
    canAccessFullDashboard, 
    canAccessPartialDashboard,
   /*  userRole */
  } = useKPI();
  
  const { 
    data: kpiData, 
    isLoading: kpiLoading, 
    refetch: _refetch 
  } = useKpiCardsData();

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

  // Refresca la página completa en lugar de solo los datos
  const refreshData = () => {
    setIsRefreshing(true);
    window.location.reload(); // Refresca la página completa
  };

  // Formateo de valores para mostrar en los KPI Cards
  const formatCurrency = (value: number) => {
    return `S/ ${value?.toLocaleString('es-PE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }) || '0.00'}`;
  };

  const formatNumber = (value: number) => {
    return value?.toLocaleString('es-PE') || '0';
  };

  // Componente de bienvenida para administrativos
  const WelcomeAdministrativo = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="p-6 bg-blue-50 rounded-full mb-4">
          <UserCheck className="h-16 w-16 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          ¡Bienvenido al Sistema Administrativo!
        </h2>
        <p className="text-gray-500 mt-2 max-w-lg">
          Accede a la información relevante sobre pacientes y citas desde este panel.
          Utiliza el menú lateral para navegar a las diferentes secciones del sistema.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="flex flex-col items-center p-6 bg-indigo-50 rounded-lg">
          <Calendar className="h-12 w-12 text-indigo-600 mb-4" />
          <h3 className="font-semibold text-gray-800">Gestión de Citas</h3>
          <p className="text-sm text-gray-500 text-center mt-2">
            Administra citas médicas para los pacientes
          </p>
        </div>
        
        <div className="flex flex-col items-center p-6 bg-green-50 rounded-lg">
          <Users className="h-12 w-12 text-green-600 mb-4" />
          <h3 className="font-semibold text-gray-800">Registro de Pacientes</h3>
          <p className="text-sm text-gray-500 text-center mt-2">
            Administra el registro de los pacientes
          </p>
        </div>
        
        <div className="flex flex-col items-center p-6 bg-amber-50 rounded-lg">
          <ClipboardList className="h-12 w-12 text-amber-600 mb-4" />
          <h3 className="font-semibold text-gray-800">Seguimientos</h3>
          <p className="text-sm text-gray-500 text-center mt-2">
            Visualiza el progreso de los tratamientos
          </p>
        </div>
      </div>
    </div>
  );

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
              {canAccessFullDashboard 
                ? "Inicio general del sistema" 
                : "Resumen del sistema administrativo"}
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

        {/* Sección de KPI Cards - Disponible para todos pero filtrada */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Resumen
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {kpiLoading ? (
              // Mostrar placeholders durante la carga
              <>
                {[...Array.from({ length: canAccessFullDashboard ? 5 : 3 })].map((_, i) => (
                  <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </>
            ) : (
              // Mostrar KPI Cards según el rol del usuario
              <>
                {/* Mostrar solo para SuperAdmin */}
                {canAccessFullDashboard && (
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
                  </>
                )}

                {/* Mostrar para todos los roles */}
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

                {/* Mostrar solo para SuperAdmin */}
                {canAccessFullDashboard && (
                  <>
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
              </>
            )}
          </div>
        </div>

        {/* Mostrar bienvenida para administrativos o contenido completo para admin */}
        {canAccessPartialDashboard && !canAccessFullDashboard ? (
          <WelcomeAdministrativo />
        ) : canAccessFullDashboard ? (
          // Contenido completo solo para SuperAdmin
          <>
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
          </>
        ) : null}
      </div>
    </LayoutAdmin>
  );
}
