import { useMemo, useState } from 'react';
import { formatNumber } from '../utils/dataProcessor';

const COLUMNS = [
  { key: 'especialidad', label: 'Especialidad', numeric: false },
  { key: 'lun', label: 'Lun 24', numeric: true },
  { key: 'mar', label: 'Mar 25', numeric: true },
  { key: 'mie', label: 'Mié 26', numeric: true },
  { key: 'jue', label: 'Jue 27', numeric: true },
  { key: 'vie', label: 'Vie 28', numeric: true },
  { key: 'total', label: 'TOTAL', numeric: true },
];

export default function DataTable({ rows }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('total');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = rows;
    if (q) {
      result = rows.filter((r) => r.especialidad.toLowerCase().includes(q));
    }

    const sorted = [...result].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return sorted;
  }, [rows, search, sortKey, sortDir]);

  const totalGeneral = useMemo(() => rows.reduce((sum, r) => sum + r.total, 0), [rows]);

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  return (
    <section className="card table-card" aria-label="Tabla de especialidades">
      <h2 className="section-title">Detalle por especialidad</h2>

      <div className="table-toolbar">
        <input
          type="search"
          className="table-search"
          placeholder="Buscar especialidad…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar especialidad"
        />
        <span className="table-meta">
          {filtered.length} de {rows.length} especialidades · Suma visible:{' '}
          {formatNumber(filtered.reduce((s, r) => s + r.total, 0))}
        </span>
      </div>

      <div className="table-scroll">
        {filtered.length === 0 ? (
          <p className="table-empty">No se encontraron especialidades para "{search}".</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={col.numeric ? 'col-numeric' : ''}
                    onClick={() => handleSort(col.key)}
                    tabIndex={0}
                    role="columnheader"
                    aria-sort={
                      sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSort(col.key);
                      }
                    }}
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <span className="sort-arrow">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.especialidad}>
                  <td>{row.especialidad}</td>
                  <td className="col-numeric">{row.lun || '-'}</td>
                  <td className="col-numeric">{row.mar || '-'}</td>
                  <td className="col-numeric">{row.mie || '-'}</td>
                  <td className="col-numeric">{row.jue || '-'}</td>
                  <td className="col-numeric">{row.vie || '-'}</td>
                  <td className="col-numeric">
                    <strong>{formatNumber(row.total)}</strong>
                  </td>
                </tr>
              ))}
              <tr className="row-total">
                <td>Total general (suma de la tabla)</td>
                <td colSpan={5} />
                <td className="col-numeric">{formatNumber(totalGeneral)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
