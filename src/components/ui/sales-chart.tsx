"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface SalesChartProps {
  data: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  isHourly?: boolean;
}

const chartConfig = {
  revenue: {
    label: "Gelir",
    color: "var(--chart-1)",
  },
  count: {
    label: "Satış Sayısı",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function SalesChart({ data, isHourly = false }: SalesChartProps) {
  // Format data for chart
  const chartData = data.map(item => ({
    date: format(new Date(item.date), isHourly ? "HH:mm" : "dd MMM", { locale: tr }),
    revenue: item.revenue,
    count: item.count,
  }));

  // Calculate trend
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = data.length > 0 ? totalRevenue / data.length : 0;
  const lastRevenue = data.length > 0 ? data[data.length - 1].revenue : 0;
  const trend = avgRevenue > 0 ? ((lastRevenue - avgRevenue) / avgRevenue * 100).toFixed(1) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Satış Trendi</CardTitle>
        <CardDescription>
          Seçilen tarih aralığındaki günlük satışlar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/1]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₺${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {data.length > 0 && (
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-medium text-muted-foreground">
                {Number(trend) > 0 ? (
                  <>
                    Ortalamadan %{Math.abs(Number(trend))} daha yüksek <TrendingUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Ortalamadan %{Math.abs(Number(trend))} daha düşük
                  </>
                )}
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
