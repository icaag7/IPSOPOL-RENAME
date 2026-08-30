import { useRef, useState } from 'react';
import { validateUploadedFile } from '../utils/validation';
import { parseSpreadsheetFile, normalizeRowsToTable } from '../utils/dataProcessor';

export default function UploadData({ onDataLoaded, showToast }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;

    const check = validateUploadedFile(file);
    if (!check.valid) {
      showToast(check.message, 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await parseSpreadsheetFile(file, check.ext);
      if (!result.success) {
        showToast(result.message, 'error');
        return;
      }

      const normalized = normalizeRowsToTable(result.rows);
      onDataLoaded(normalized);
      showToast('Archivo cargado correctamente.', 'success');
    } catch (error) {
      showToast('Ocurrió un error inesperado al procesar el archivo.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-zone no-print">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => inputRef.current && inputRef.current.click()}
        disabled={loading}
      >
        {loading && <span className="loading-spinner loading-spinner--dark" aria-hidden="true" />}
        {loading ? 'Procesando…' : '📁 Cargar datos'}
      </button>
      <span className="upload-hint">Formatos soportados: .csv, .xlsx, .xls (máx. 10MB)</span>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="visually-hidden"
        aria-label="Cargar archivo de datos"
      />
    </div>
  );
}
