import { useCallback, useEffect, useState } from 'react';

import Login from './components/Login';
import WelcomeDashboard from './components/WelcomeDashboard';
import Header from './components/Header';
import KPICards from './components/KPICards';
import DataTable from './components/DataTable';
import UploadData from './components/UploadData';
import Footer from './components/Footer';
import DailyLineChart from './components/Charts/LineChart';
import BarChartHorizontal from './components/Charts/BarChartHorizontal';
import ServiciosPieChart from './components/Charts/PieChart';
import CortesiasBarChart from './components/Charts/BarChart';

import initialDataset from './data/initialData';
import { exportElementToPDF } from './utils/exportPDF';
import { exportElementToPNG } from './utils/exportPNG';
import { printDashboard, copyTableToClipboard } from './utils/exportUtils';

const SCREENS = {
  LOGIN: 'login',
  WELCOME: 'welcome',
  DASHBOARD: 'dashboard',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOGIN);
  const [tableRows, setTableRows] = useState(initialDataset.tabla);
  const [busy, setBusy] = useState(null); // 'pdf' | 'png' | null
  const [toast, setToast] = useState(null);

  // Restaurar sesión de demostración si existe
  useEffect(() => {
    const existing = sessionStorage.getItem('ipsopol_session');
    if (existing) {
      setScreen(SCREENS.WELCOME);
    }
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3200);
  }, []);

  function handleLoginSuccess() {
    setScreen(SCREENS.WELCOME);
  }

  function handleLogout() {
    sessionStorage.removeItem('ipsopol_session');
    setScreen(SCREENS.LOGIN);
  }

  async function handleDownloadPDF() {
    setBusy('pdf');
    try {
      await exportElementToPDF('dashboard-export-root', 'ipsopol-dashboard.pdf');
      showToast('PDF exportado correctamente.', 'success');
    } catch (error) {
      showToast('No se pudo generar el PDF.', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function handleExportPNG() {
    setBusy('png');
    try {
      await exportElementToPNG('dashboard-export-root', 'ipsopol-dashboard.png');
      showToast('Imagen PNG exportada correctamente.', 'success');
    } catch (error) {
      showToast('No se pudo generar el PNG.', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function handleCopy() {
    const ok = await copyTableToClipboard(tableRows);
    showToast(ok ? 'Datos copiados al portapapeles.' : 'No se pudo copiar los datos.', ok ? 'success' : 'error');
  }

  if (screen === SCREENS.LOGIN) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (screen === SCREENS.WELCOME) {
    return <WelcomeDashboard onContinue={() => setScreen(SCREENS.DASHBOARD)} showToast={showToast} />;
  }

  return (
    <div id="dashboard-export-root">
      <Header
        onDownloadPDF={handleDownloadPDF}
        onExportPNG={handleExportPNG}
        onPrint={printDashboard}
        onCopy={handleCopy}
        onLogout={handleLogout}
        busy={busy}
      />

      <main className="dashboard-main">
        <KPICards kpis={initialDataset.kpis} />

        <section className="charts-grid">
          <article className="card chart-card">
            <div className="chart-card-header">
              <span className="chart-card-title">Actividades por día</span>
              <span className="chart-card-subtitle">Lun–Vie</span>
            </div>
            <DailyLineChart data={initialDataset.diario} />
            <p className="chart-note">{initialDataset.notaDiscrepancia}</p>
          </article>

          <article className="card chart-card">
            <div className="chart-card-header">
              <span className="chart-card-title">Top 5 especialidades</span>
            </div>
            <BarChartHorizontal data={initialDataset.topEspecialidades} />
          </article>

          <article className="card chart-card">
            <div className="chart-card-header">
              <span className="chart-card-title">Distribución de servicios</span>
            </div>
            <ServiciosPieChart data={initialDataset.servicios} />
          </article>

          <article className="card chart-card">
            <div className="chart-card-header">
              <span className="chart-card-title">Cortesías otorgadas</span>
              <span className="chart-card-subtitle">Total: 10 · {initialDataset.cortesiasValorBs.toLocaleString('es-VE')} Bs.</span>
            </div>
            <CortesiasBarChart data={initialDataset.cortesias} />
          </article>
        </section>

        <section className="no-print">
          <UploadData onDataLoaded={setTableRows} showToast={showToast} />
        </section>

        <DataTable rows={tableRows} />
      </main>

      <Footer />

      {toast && (
        <div className={`toast toast--${toast.type}`} role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}
