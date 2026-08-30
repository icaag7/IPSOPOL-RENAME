import actividades from './actividades.json';
import especialidades from './especialidades.json';
import cortesias from './cortesias.json';

/**
 * Fuente central de datos del dashboard.
 *
 * REGLA DE INTEGRIDAD DE DATOS (no negociable):
 * - El total oficial de actividades realizadas es 2.940 (actividades.total).
 * - El desglose por servicio (Médicos, Funerarios, Citas, Jubilados, Club)
 *   SÍ suma 2.940.
 * - El desglose DIARIO suministrado (Lun..Vie) suma 2.263, NO 2.940.
 * - Esta diferencia es un dato real de la fuente y NO debe "corregirse",
 *   redistribuirse ni completarse inventando actividades faltantes.
 * - El KPI principal siempre debe mostrar 2.940 (el total oficial).
 * - El gráfico diario siempre debe usar los valores diarios tal cual
 *   fueron suministrados (472, 308, 393, 443, 647), acompañados de la
 *   nota de discrepancia definida en actividades.notaDiscrepancia.
 */

export const PERIODO = {
  etiqueta: '22–28 de agosto de 2026',
  semana: '4TA SEMANA DE AGOSTO 2026',
  rango: '22 — 28 DE AGOSTO DE 2026',
};

// Top 5 especialidades (dato fijo suministrado, no derivado de la tabla,
// para preservar exactamente los valores entregados)
export const TOP_ESPECIALIDADES = [
  { nombre: 'Enfermería', valor: 184 },
  { nombre: 'Fisioterapia', valor: 171 },
  { nombre: 'Odontología', valor: 155 },
  { nombre: 'Medicina General', valor: 57 },
  { nombre: 'Ecografía', valor: 19 },
];

export const SERVICIOS_PIE = [
  { nombre: 'Atenciones Médicas', valor: actividades.desglose['Médicos'] },
  { nombre: 'Funerarios', valor: actividades.desglose['Funerarios'] },
  { nombre: 'Citas Médicas', valor: actividades.desglose['Citas'] },
  { nombre: 'Jubilados', valor: actividades.desglose['Jubilados'] },
  { nombre: 'Club', valor: actividades.desglose['Club'] },
];

export const DIARIO_CHART = Object.entries(actividades.diario).map(([dia, valor]) => ({
  dia,
  valor,
}));

export const CORTESIAS_CHART = Object.entries(cortesias.desglose).map(([nombre, valor]) => ({
  nombre,
  valor,
}));

export const KPIS = {
  actividades: {
    total: actividades.total,
    desglose: actividades.desglose,
  },
  atencionesMedicas: {
    total: actividades.desglose['Médicos'],
    top: {
      Enfermería: 184,
      Fisioterapia: 171,
      Odontología: 155,
    },
  },
  cortesias: {
    total: cortesias.total,
    valorBs: cortesias.valorBs,
  },
};

export const NOTA_DISCREPANCIA = actividades.notaDiscrepancia;

export const initialDataset = {
  periodo: PERIODO,
  kpis: KPIS,
  diario: DIARIO_CHART,
  topEspecialidades: TOP_ESPECIALIDADES,
  servicios: SERVICIOS_PIE,
  cortesias: CORTESIAS_CHART,
  cortesiasValorBs: cortesias.valorBs,
  tabla: especialidades,
  notaDiscrepancia: NOTA_DISCREPANCIA,
};

export default initialDataset;
