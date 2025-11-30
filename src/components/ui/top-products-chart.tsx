"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface TopProductsChartProps {
  products: Array<{
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
}

const chartConfig = {
  revenue: {
    label: "Gelir",
  },
  product1: {
    label: "Ürün 1",
    color: "var(--chart-1)",
  },
  product2: {
    label: "Ürün 2",
    color: "var(--chart-2)",
  },
  product3: {
    label: "Ürün 3",
    color: "var(--chart-3)",
  },
  product4: {
    label: "Ürün 4",
    color: "var(--chart-4)",
  },
  product5: {
    label: "Ürün 5",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function TopProductsChart({ products }: TopProductsChartProps) {
  const chartData = products.map((product, index) => ({
    name: product.productName,
    revenue: product.totalRevenue,
    fill: `var(--chart-${index + 1})`,
  }));

  const totalRevenue = products.reduce((sum, p) => sum + p.totalRevenue, 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>En Çok Satan Ürünler</CardTitle>
        <CardDescription>Seçilen tarih aralığı</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="name"
                    formatter={(value) => `₺${Number(value).toFixed(2)}`}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="revenue"
                nameKey="name"
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Bu tarih aralığında satış yok
          </div>
        )}
      </CardContent>
    </Card>
  )
}
