/* import { addDays } from "date-fns"; */

// Fechas fijas que no cambian de día entre años
const FIXED_HOLIDAYS = [
  { month: 1, day: 1, description: "Año Nuevo" },
  { month: 5, day: 1, description: "Día del Trabajo" },
  { month: 6, day: 7, description: "Batalla de Arica" },
  { month: 6, day: 29, description: "San Pedro y San Pablo" },
  { month: 7, day: 23, description: "Día de la Fuerza Aérea" },
  { month: 7, day: 28, description: "Fiestas Patrias" },
  { month: 7, day: 29, description: "Fiestas Patrias" },
  { month: 8, day: 6, description: "Batalla de Junín" },
  { month: 8, day: 30, description: "Santa Rosa de Lima" },
  { month: 10, day: 8, description: "Combate de Angamos" },
  { month: 11, day: 1, description: "Día de Todos los Santos" },
  { month: 12, day: 8, description: "Inmaculada Concepción" },
  { month: 12, day: 9, description: "Batalla de Ayacucho" },
  { month: 12, day: 25, description: "Navidad" },
];

/**
 * Calcula la fecha de Pascua para un año específico usando el algoritmo de Meeus/Jones/Butcher
 */
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

/**
 * Genera todas las fechas feriadas para un año específico
 */
export function generateHolidays(
  year: number = new Date().getFullYear()
): string[] {
  const holidays = [];

  // Agregar fechas fijas
  FIXED_HOLIDAYS.forEach((holiday) => {
    const date = new Date(year, holiday.month - 1, holiday.day);
    holidays.push({
      date: date.toISOString().split("T")[0],
      description: holiday.description,
    });
  });

  // Calcular Semana Santa (fechas móviles)
  const easterSunday = calculateEaster(year);

  // Jueves Santo (3 días antes de Pascua)
  const holyThursday = new Date(easterSunday);
  holyThursday.setDate(easterSunday.getDate() - 3);
  holidays.push({
    date: holyThursday.toISOString().split("T")[0],
    description: "Jueves Santo",
  });

  // Viernes Santo (2 días antes de Pascua)
  const goodFriday = new Date(easterSunday);
  goodFriday.setDate(easterSunday.getDate() - 2);
  holidays.push({
    date: goodFriday.toISOString().split("T")[0],
    description: "Viernes Santo",
  });

  // Ordenar por fecha y devolver solo las fechas en formato string
  return holidays
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((h) => h.date);
}

// Exportar las fechas para el año actual por defecto
export const CURRENT_YEAR_HOLIDAYS = generateHolidays();
