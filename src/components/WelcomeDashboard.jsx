import { useState } from 'react';
import { PERIODO } from '../data/initialData';
import { exportElementToPDF } from '../utils/exportPDF';
import { printDashboard } from '../utils/exportUtils';

export default function WelcomeDashboard({ onContinue, showToast }) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      await exportElementToPDF('welcome-export-root', 'ipsopol-presentacion.pdf');
      showToast('PDF de presentación descargado.', 'success');
    } catch (error) {
      showToast('No se pudo generar el PDF. Intenta nuevamente.', 'error');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="welcome-screen" id="welcome-export-root">
      <img
        src="/logo-ipsopol.png"
        alt="Logotipo institucional IPSOPOL (placeholder)"
        className="welcome-logo"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <p className="welcome-brand">IPSOPOL</p>

      <h1 className="welcome-title">
        DASHBOARD EJECUTIVO
        <br />
        DE GESTIÓN
      </h1>

      <div className="welcome-week">{PERIODO.semana}</div>
      <p className="welcome-range">{PERIODO.rango}</p>

      <p className="welcome-subtitle">
        Sistema de visualización y análisis de indicadores de gestión institucional.
      </p>

      <div className="welcome-actions no-print">
        <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
          {downloading && <span className="loading-spinner" aria-hidden="true" />}
          {downloading ? 'Generando…' : '↓ DESCARGAR'}
        </button>
        <button className="btn btn-outline" onClick={printDashboard}>
          🖨 IMPRIMIR
        </button>
        <button className="btn btn-outline" onClick={onContinue}>
          Continuar al dashboard →
        </button>
      </div>

      <p className="welcome-footnote">IPSOPOL — Instituto de Previsión Social. Uso institucional.</p>
    </div>
  );
}
