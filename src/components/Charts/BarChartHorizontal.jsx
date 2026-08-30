import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

const COLORS = ['#0066cc', '#0077e0', '#0088ff', '#199bff', '#00aaff'];

export default function BarChartHorizontal({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 32, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis
          type="category"
          dataKey="nombre"
          width={120}
          tick={{ fontSize: 12, fill: '#333' }}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <Tooltip
          formatter={(value) => [`${value} atenciones`, '']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
        />
        <Bar dataKey="valor" radius={[0, 6, 6, 0]} animationDuration={700}>
          {data.map((entry, index) => (
            <Cell key={entry.nombre} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList dataKey="valor" position="right" style={{ fontSize: 12, fill: '#333', fontWeight: 600 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
