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
  // Datos por defecto
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
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <SimpleCard title="Pacientes" total={400} />
        <SimpleCard title="Doctores" total={3} />
        <SimpleCard title="Citas del mes" total={350} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <h3>Pacientes por mes</h3>
          <div style={{ height: '300px' }}>
          <ResponsiveBar
            data={pacientesPorMes}
            keys={['pacientes']}
            indexBy="mes"
            margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
            padding={0.3}
            axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Mes', legendPosition: 'middle', legendOffset: 32 }}
            axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Pacientes', legendPosition: 'middle', legendOffset: -40 }}
            colors={['#00BFFF', '#1E90FF', '#87CEFA', '#4682B4', '#5F9EA0', '#ADD8E6']} // Tonos celestes
          />
          </div>
        </div>

        <div style={{ width: '48%' }}>
          <h3>Citas por Departamento</h3>
          <div style={{ height: '300px' }}>
          <ResponsivePie
            data={citasPorDepartamento}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={['#00BFFF', '#1E90FF', '#87CEFA', '#4682B4', '#5F9EA0', '#ADD8E6']} // Tonos celestes
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

// Cambiamos el nombre del componente Card a SimpleCard para evitar el conflicto
const SimpleCard: React.FC<CardProps> = ({ title, total }) => (
  <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '30%' }}>
    <h2>{title}</h2>
    <p>Total: {total}</p>
  </div>
);

export default DashboardReport;
