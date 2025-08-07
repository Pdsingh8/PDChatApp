"use client";
import TableComponent from "./TableComponent";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type ChartData =
  | {
      type: "line" | "bar" | "pie";
      data: { [key: string]: any }[];
      xKey: string;
      yKey: string;
    }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    };

export default function ChartComponent({ chart }: { chart: ChartData }) {
  if (chart.type === "table") {
    return <TableComponent headers={chart.headers} rows={chart.rows} />;
  }
  const { type, data, xKey, yKey } = chart;

  if (!data || !xKey || !yKey) return null;

  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey={yKey}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yKey} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
