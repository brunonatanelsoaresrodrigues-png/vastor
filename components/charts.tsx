"use client";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { money } from "@/lib/utils";
type ChartRow = Record<string, string | number>;
export function TrendChart({
  data,
  keys = [{ key: "coverage", label: "Adesão", color: "#386bea" }],
  x = "month",
  currency = false,
  height = 230,
}: {
  data: ChartRow[];
  keys?: { key: string; label: string; color: string }[];
  x?: string;
  currency?: boolean;
  height?: number;
}) {
  return (
    <div
      className="chart"
      style={{ height }}
      role="img"
      aria-label={`Gráfico de ${keys.map((k) => k.label).join(", ")}. ${data.map((d) => `${d[x]}: ${keys.map((k) => `${k.label} ${currency ? money(Number(d[k.key])) : d[k.key]}`).join(", ")}`).join("; ")}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 14, left: -12, bottom: 0 }}>
          <defs>
            {keys.map((k) => (
              <linearGradient key={k.key} id={`fill-${k.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={k.color} stopOpacity={0.16} />
                <stop offset="100%" stopColor={k.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="4 5" vertical={false} stroke="#e9edf3" />
          <XAxis
            dataKey={x}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8a95a7", fontSize: 11 }}
            dy={9}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8a95a7", fontSize: 11 }}
            tickFormatter={(v) => (currency ? `${Number(v) / 1000}k` : `${v}%`)}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e8edf4", fontSize: 12 }}
            formatter={(v, n) => [currency ? money(Number(v)) : `${v}%`, n]}
          />
          {keys.map((k) => (
            <Area
              key={k.key}
              type="monotone"
              dataKey={k.key}
              name={k.label}
              stroke={k.color}
              strokeWidth={2.5}
              fill={`url(#fill-${k.key})`}
              animationDuration={650}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export function CostChart({ data }: { data: ChartRow[] }) {
  return (
    <div
      className="chart"
      style={{ height: 260 }}
      role="img"
      aria-label="Composição mensal de contratos, subsídios e plataforma, valores demonstrativos"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="4 5" stroke="#e9edf3" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#8a95a7" }}
          />
          <YAxis
            tickFormatter={(v) => `${v / 1000}k`}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#8a95a7" }}
          />
          <Tooltip
            formatter={(v, n) => [money(Number(v)), n]}
            contentStyle={{ borderRadius: 12, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="contracts" name="Contratos" stackId="a" fill="#1c3356" barSize={32} />
          <Bar dataKey="subsidy" name="Subsídios" stackId="a" fill="#467cf2" />
          <Bar
            dataKey="platform"
            name="Plataforma"
            stackId="a"
            fill="#a7c6ff"
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
