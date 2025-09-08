
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";

// This component is not currently in use. The data is hardcoded.
// It can be repurposed later to show real data from Firestore.
const chartData = [
  { class: "Engenharia A", students: 180 },
  { class: "Comp. B", students: 200 },
  { class: "Letras C", students: 120 },
  { class: "Física A", students: 80 },
  { class: "Medicina F", students: 250 },
  { class: "Direito G", students: 150 },
];

const chartConfig = {
  students: {
    label: "Alunos",
    color: "hsl(var(--primary))",
  },
};

export function DashboardCharts() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="class"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            
          />
          <YAxis />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="students" fill="var(--color-students)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
