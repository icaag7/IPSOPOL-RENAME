import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '8px 12px',
        boxShadow: '0 4px 12px rgba(15,23,42,0.12)',
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#0066cc' }}>{payload[0].value} actividades</div>
    </div>
  );
}

export default function DailyLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ReLineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#e2e8f0' }}>
          <Label value="Actividades" angle={-90} position="insideLeft" style={{ fontSize: 11, fill: '#888' }} />
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="valor"
          stroke="#0066cc"
          strokeWidth={3}
          dot={{ r: 4, fill: '#0066cc' }}
          activeDot={{ r: 6 }}
          animationDuration={700}
          label={{ position: 'top', fontSize: 11, fill: '#333' }}
        />
      </ReLineChart>
    </ResponsiveContainer>
  );
}
