import { PERIODO } from '../data/initialData';

export default function Header({
  onDownloadPDF,
  onExportPNG,
  onPrint,
  onCopy,
  onLogout,
  busy,
}) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-header-brand">
          <img
            src="/logo-ipsopol.png"
            alt="Logotipo institucional IPSOPOL (placeholder)"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="app-header-titles">
            <h1>Dashboard Ejecutivo de Gestión</h1>
            <p>Período: {PERIODO.etiqueta}</p>
          </div>
        </div>

        <nav className="app-header-actions no-print" aria-label="Acciones del dashboard">
          <button className="btn btn-secondary" onClick={onDownloadPDF} disabled={busy}>
            {busy === 'pdf' ? <span className="loading-spinner loading-spinner--dark" /> : '↓'} Descargar PDF
          </button>
          <button className="btn btn-secondary" onClick={onExportPNG} disabled={busy}>
            {busy === 'png' ? <span className="loading-spinner loading-spinner--dark" /> : '🖼'} Exportar PNG
          </button>
          <button className="btn btn-secondary" onClick={onPrint}>
            🖨 Imprimir
          </button>
          <button className="btn btn-secondary" onClick={onCopy}>
            📋 Copiar datos
          </button>
          <button className="btn btn-ghost" onClick={onLogout}>
            Salir
          </button>
        </nav>
      </div>
    </header>
  );
}
