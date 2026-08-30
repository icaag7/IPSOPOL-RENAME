export function printDashboard() {
  window.print();
}

/**
 * Copia los datos de la tabla al portapapeles en formato TSV
 * (pegable directamente en Excel/Sheets).
 */
export async function copyTableToClipboard(tableRows) {
  const headers = ['Especialidad', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'TOTAL'];
  const lines = [headers.join('\t')];

  tableRows.forEach((row) => {
    lines.push(
      [row.especialidad, row.lun, row.mar, row.mie, row.jue, row.vie, row.total].join('\t')
    );
  });

  const text = lines.join('\n');

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    throw new Error('Clipboard API no disponible');
  } catch (error) {
    // Fallback para navegadores/entornos sin permisos de portapapeles
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(textarea);
    return ok;
  }
}
