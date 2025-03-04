// Interfaces para KPIs

// Interfaz para pacientes por sucursal (gráfico de líneas)
export interface PacientePorSucursalItem {
  month: string;
  JLBYR: number;
  Yanahuara: number;
}

export type PacientesPorSucursalData = PacientePorSucursalItem[];

// Tipo para respuestas del servidor que pueden contener error
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
