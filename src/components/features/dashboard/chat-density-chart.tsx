"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { id } from "date-fns/locale";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { getChatHistoryByDateRange } from "@/lib/actions/dashboard";
import { Loader2 } from "lucide-react";

export default function ChatDensityChart({ from, to }: { from: string; to: string }) {
  const [data, setData] = useState<{ date: string; displayDate: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await getChatHistoryByDateRange(from, to);
        
        // Fill in missing days
        const startDate = new Date(from);
        const endDate = new Date(to);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const filledData = [];
        for (let i = 0; i <= diffDays; i++) {
          const d = new Date(startDate);
          d.setDate(d.getDate() + i);
          const dStr = format(d, "yyyy-MM-dd");
          const existing = result.find(r => r.date === dStr);
          filledData.push({
            date: dStr,
            displayDate: format(d, "dd MMM", { locale: id }),
            count: existing ? existing.count : 0
          });
        }
        setData(filledData);
      } catch (err) {
        console.error("Failed to load chart data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [from, to]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
        <XAxis 
          dataKey="displayDate" 
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          allowDecimals={false}
        />
        <Tooltip 
          cursor={{ fill: '#0595d7', opacity: 0.1 }}
          contentStyle={{ 
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            color: 'var(--foreground)'
          }}
          labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold', marginBottom: '4px' }}
          itemStyle={{ color: '#0595d7' }}
        />
        <Bar 
          dataKey="count" 
          name="Total Chat" 
          fill="#0595d7" 
          radius={[4, 4, 0, 0]} 
          activeBar={{ fill: '#0595d7', stroke: '#0595d7', strokeWidth: 2, opacity: 0.8 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
