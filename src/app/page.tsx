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
} from "lucide-react";
import { KPICard } from "./(dashboard)/CardChart";
import { KPIBarChartCustom } from "./(dashboard)/BarChartCustom";
import { KPIAreaChart } from "./(dashboard)/AreaChart";
import Link from "next/link";

export default function Home() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      setCurrentDateTime(now.toLocaleDateString('es-ES', options));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Actualiza cada minuto
    
    return () => clearInterval(interval);
  }, []);

  return (
    <LayoutAdmin>
      <div className="flex flex-col w-full gap-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-md border p-2 text-sm">
              <CalendarIcon className="h-4 w-4" />
              <span>{currentDateTime}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button 
            className={`px-4 py-2 ${activeTab === "resumen" ? "border-b-2 border-primary font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("resumen")}
          >
            Resumen
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === "analiticas" ? "border-b-2 border-primary font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("analiticas")}
          >
            Analíticas
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link href="/ingresos" className="block">
            <KPICard
              title="Total Ingresos"
              value="S/ 5,231.89"
              description="Total de ingresos del mes"
              icon={<DollarSign className="h-5 w-5" />}
            />
          </Link>
          <Link href="/clientes" className="block">
            <KPICard
              title="Clientes"
              value="235"
              description="Total de clientes atendidos"
              icon={<Users className="h-5 w-5" />}
            />
          </Link>
          <Link href="/citas" className="block">
            <KPICard
              title="Citas"
              value="124"
              description="Total de citas atendidas"
              icon={<Calendar className="h-5 w-5" />}
            />
          </Link>
          <Link href="/citas-pendientes" className="block">
            <KPICard
              title="Citas pendientes"
              value="15"
              description="Citas pendientes el día de hoy"
              icon={<AlertTriangle className="h-5 w-5" />}
            />
          </Link>
          <Link href="/ingresos-promedio" className="block">
            <KPICard
              title="Ingreso promedio"
              value="S/ 98.50"
              description="Ingreso promedio por médico"
              icon={<DollarSign className="h-5 w-5" />}
            />
          </Link>
        </div>

        {activeTab === "resumen" ? (
          <>
            {/* Charts - Resumen */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left column - 2/3 width */}
              <div className="lg:col-span-2">
                <div className="bg-white p-4 rounded-lg border">
                  <KPIBarChart />
                </div>
              </div>

              {/* Right column - 1/3 width */}
              <div>
                <div className="bg-white p-4 rounded-lg border">
                  <KPIBarChartCustom />
                </div>
              </div>
            </div>

            {/* Segunda fila de gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left column - 2/3 width */}
              <div className="lg:col-span-2">
                <div className="bg-white p-4 rounded-lg border">
                  <KPILineChartMultiple />
                </div>
              </div>

              {/* Right column - 1/3 width */}
              <div>
                <div className="bg-white p-4 rounded-lg border">
                  <KPIBarChartStacked />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Charts - Analíticas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Mismos gráficos para demostración */}
              <div className="lg:col-span-2">
                <div className="bg-white p-4 rounded-lg border">
                  <KPIBarChart />
                </div>
              </div>
              <div>
                <div className="bg-white p-4 rounded-lg border">
                  <KPIBarChartCustom />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <div className="bg-white p-4 rounded-lg border">
                  <KPILineChartMultiple />
                </div>
              </div>
              <div>
                <div className="bg-white p-4 rounded-lg border">
                  <KPIBarChartStacked />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Componente a ancho completo al pie */}
      <div className="w-full px-6 pb-6">
        <div className="bg-white p-4 rounded-lg border w-full">
          <KPIAreaChart />
        </div>
      </div>
    </LayoutAdmin>
  );
}

