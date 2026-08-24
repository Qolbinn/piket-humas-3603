"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { DateRangeFilter } from "@/components/features/eskalasi/DateRangeFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["#0595d7", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#64748b"];

interface DataItem {
  name: string;
  value: number;
}

interface PieChartsProps {
  categoryData: DataItem[];
  channelData: DataItem[];
  defaultFrom?: Date;
  defaultTo?: Date;
}

export function DashboardPieCharts({ categoryData, channelData, defaultFrom, defaultTo }: PieChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Kategori Layanan */}
      <Card className="flex flex-col h-[400px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Distribusi Kategori Layanan</CardTitle>
            <p className="text-xs text-muted-foreground">Persentase tiket eskalasi per kategori</p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangeFilter 
              paramFrom="pie_from" 
              paramTo="pie_to" 
              defaultFrom={defaultFrom}
              defaultTo={defaultTo}
              className="scale-90 origin-right" 
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-4 pt-4">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value} Tiket`, 'Jumlah']}
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <PieChartIcon className="h-8 w-8 opacity-20" />
              <span className="text-sm">Belum ada data di rentang waktu ini</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Jalur Komunikasi */}
      <Card className="flex flex-col h-[400px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Jalur Komunikasi (Channels)</CardTitle>
            <p className="text-xs text-muted-foreground">Platform asal masuknya pelanggan</p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangeFilter 
              paramFrom="pie_from" 
              paramTo="pie_to" 
              defaultFrom={defaultFrom}
              defaultTo={defaultTo}
              className="scale-90 origin-right" 
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-4 pt-4">
          {channelData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value} Tiket`, 'Jumlah']}
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <PieChartIcon className="h-8 w-8 opacity-20" />
              <span className="text-sm">Belum ada data di rentang waktu ini</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
