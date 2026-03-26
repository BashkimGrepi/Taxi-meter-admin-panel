import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartData {
  name: string;
  value: number;
}

interface BarChartComponentProps {
  data: BarChartData[];
}

export const BarChartComponent = ({ data }: BarChartComponentProps) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data} barSize={60} barGap={10}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
      <YAxis
        stroke="#64748b"
        fontSize={12}
        tickLine={false}
        tickFormatter={(value) => `€${value.toLocaleString()}`}
      />
      <Tooltip
        formatter={(value: number | undefined) =>
          value ? [`€${value.toLocaleString()}`, "Amount"] : ["€0", "Amount"]
        }
        contentStyle={{
          backgroundColor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      />
      <Legend />
      <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
