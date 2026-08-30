import * as XLSX from 'xlsx';
import { validateParsedRows } from './validation';

/**
 * Lee un archivo CSV o Excel (xlsx/xls) y lo convierte en un array
 * de objetos plano (una fila = un objeto, llaves = encabezados).
 * Nunca lanza hacia la UI: retorna { success, rows, message }.
 */
export async function parseSpreadsheetFile(file, ext) {
  try {
    const buffer = await file.arrayBuffer();
    const workbook =
      ext === 'csv'
        ? XLSX.read(buffer, { type: 'array', raw: false })
        : XLSX.read(buffer, { type: 'array' });

    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return { success: false, rows: [], message: 'El archivo no contiene hojas de datos.' };
    }

    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const check = validateParsedRows(rows);
    if (!check.valid) {
      return { success: false, rows: [], message: check.message };
    }

    return { success: true, rows, message: 'Archivo cargado correctamente.' };
  } catch (error) {
    return {
      success: false,
      rows: [],
      message: 'No se pudo procesar el archivo. Verifica que no esté dañado o protegido.',
    };
  }
}

/**
 * Normaliza filas crudas (de CSV/XLSX) al formato de tabla que
 * usa el dashboard: { especialidad, lun, mar, mie, jue, vie, total }.
 * Columnas de día no reconocidas se ignoran; si falta el total,
 * se calcula sumando los días detectados.
 */
export function normalizeRowsToTable(rows) {
  const dayAliases = {
    lun: 'lun',
    lunes: 'lun',
    mar: 'mar',
    martes: 'mar',
    mie: 'mie',
    mié: 'mie',
    miercoles: 'mie',
    miércoles: 'mie',
    jue: 'jue',
    jueves: 'jue',
    vie: 'vie',
    viernes: 'vie',
  };

  return rows.map((row, index) => {
    const normalized = { especialidad: '', lun: 0, mar: 0, mie: 0, jue: 0, vie: 0, total: 0 };
    let hasTotal = false;

    Object.entries(row).forEach(([key, value]) => {
      const k = key.trim().toLowerCase();

      if (['especialidad', 'nombre', 'servicio', 'categoria', 'categoría'].includes(k)) {
        normalized.especialidad = String(value).trim();
        return;
      }

      if (dayAliases[k]) {
        const num = Number(value) || 0;
        normalized[dayAliases[k]] = num;
        return;
      }

      if (k === 'total') {
        normalized.total = Number(value) || 0;
        hasTotal = true;
      }
    });

    if (!normalized.especialidad) {
      normalized.especialidad = `Fila ${index + 1}`;
    }

    if (!hasTotal) {
      normalized.total = normalized.lun + normalized.mar + normalized.mie + normalized.jue + normalized.vie;
    }

    return normalized;
  });
}

export function formatBs(value) {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
  })
    .format(value)
    .replace('VES', 'Bs.');
}

export function formatNumber(value) {
  return new Intl.NumberFormat('es-VE').format(value);
}
