import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

const COLORS = ['#0066cc', '#0088ff', '#00aaff'];

export default function CortesiasBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ReBarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="nombre" tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#e2e8f0' }} allowDecimals={false} />
        <Tooltip
          formatter={(value) => [`${value} cortesías`, '']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
        />
        <Bar dataKey="valor" radius={[6, 6, 0, 0]} animationDuration={700} maxBarSize={70}>
          {data.map((entry, index) => (
            <Cell key={entry.nombre} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList dataKey="valor" position="top" style={{ fontSize: 12, fill: '#333', fontWeight: 700 }} />
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  );
}
