import { formatNumber, formatBs } from '../utils/dataProcessor';

export default function KPICards({ kpis }) {
  return (
    <section aria-label="Indicadores clave">
      <div className="kpi-grid">
        <article className="card kpi-card">
          <span className="kpi-card-value">{formatNumber(kpis.actividades.total)}</span>
          <span className="kpi-card-label">Actividades Realizadas</span>
          <div className="kpi-card-breakdown">
            {Object.entries(kpis.actividades.desglose).map(([label, value]) => (
              <div className="kpi-card-breakdown-row" key={label}>
                <span>{label}</span>
                <strong>{formatNumber(value)}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="card kpi-card">
          <span className="kpi-card-value">{formatNumber(kpis.atencionesMedicas.total)}</span>
          <span className="kpi-card-label">Atenciones Médicas</span>
          <div className="kpi-card-breakdown">
            {Object.entries(kpis.atencionesMedicas.top).map(([label, value]) => (
              <div className="kpi-card-breakdown-row" key={label}>
                <span>{label}</span>
                <strong>{formatNumber(value)}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="card kpi-card">
          <span className="kpi-card-value">{formatNumber(kpis.cortesias.total)}</span>
          <span className="kpi-card-label">Cortesías Otorgadas</span>
          <div className="kpi-card-breakdown">
            <div className="kpi-card-breakdown-row">
              <span>Valor total</span>
              <strong>{formatBs(kpis.cortesias.valorBs)}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
