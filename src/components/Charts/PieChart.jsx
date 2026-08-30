import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0066cc', '#0088ff', '#00aaff', '#5bb8ff', '#8fd0ff'];

function renderLabel({ percent }) {
  return `${(percent * 100).toFixed(1)}%`;
}

export default function ServiciosPieChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.valor, 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie
          data={data}
          dataKey="valor"
          nameKey="nombre"
          cx="50%"
          cy="50%"
          outerRadius={95}
          innerRadius={50}
          label={renderLabel}
          labelLine={false}
          animationDuration={700}
        >
          {data.map((entry, index) => (
            <Cell key={entry.nombre} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [
            `${value} (${((value / total) * 100).toFixed(1)}%)`,
            name,
          ]}
          contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
        />
        <Legend
          verticalAlign="bottom"
          height={48}
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value) => <span style={{ color: '#333' }}>{value}</span>}
        />
      </RePieChart>
    </ResponsiveContainer>
  );
}
