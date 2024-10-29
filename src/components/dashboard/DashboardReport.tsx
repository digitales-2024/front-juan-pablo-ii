"use client"

import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';

interface CardProps {
  title: string;
  total: number;
}

interface PacientesPorMes {
  mes: string;
  pacientes: number;
}

interface CitasPorDepartamento {
  id: string;
  label: string;
  value: number;
}

const DashboardReport: React.FC = () => {
  // Datos por defecto (sin cambios)
  const citasPorDepartamento: CitasPorDepartamento[] = [
    { id: 'Ácido Hialurónico', label: 'Ácido Hialurónico', value: 35 },
    { id: 'Radiofrecuencia', label: 'Radiofrecuencia', value: 25 },
    { id: 'Acné y sus secuelas', label: 'Acné y sus secuelas', value: 20 },
    { id: 'Otros', label: 'Otros', value: 20 }
  ];

  const pacientesPorMes: PacientesPorMes[] = [
    { mes: 'Enero', pacientes: 150 },
    { mes: 'Febrero', pacientes: 200 },
    { mes: 'Marzo', pacientes: 250 },
    { mes: 'Abril', pacientes: 300 },
    { mes: 'Mayo', pacientes: 350 },
    { mes: 'Junio', pacientes: 380 },
    { mes: 'Julio', pacientes: 400 }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SimpleCard title="Pacientes" total={400} />
        <SimpleCard title="Doctores" total={3} />
        <SimpleCard title="Citas del mes" total={350} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Pacientes por mes</h3>
          <div className="h-[300px]">
            <ResponsiveBar
              data={pacientesPorMes}
              keys={['pacientes']}
              indexBy="mes"
              margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
              padding={0.3}
              axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Mes', legendPosition: 'middle', legendOffset: 32 }}
              axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Pacientes', legendPosition: 'middle', legendOffset: -40 }}
              colors={['#00BFFF', '#1E90FF', '#87CEFA', '#4682B4', '#5F9EA0', '#ADD8E6']}
            />
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Citas por Departamento</h3>
          <div className="h-[300px]">
            <ResponsivePie
              data={citasPorDepartamento}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={['#00BFFF', '#1E90FF', '#87CEFA', '#4682B4', '#5F9EA0', '#ADD8E6']}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              radialLabelsSkipAngle={10}
              radialLabelsTextColor="#333333"
              radialLabelsLinkColor={{ from: 'color' }}
              sliceLabelsSkipAngle={10}
              sliceLabelsTextColor="#333333"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SimpleCard: React.FC<CardProps> = ({ title, total }) => (
  <div className="p-4 border border-gray-200 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-2xl font-bold">Total: {total}</p>
  </div>
);

export default DashboardReport;