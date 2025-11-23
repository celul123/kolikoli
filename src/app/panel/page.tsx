"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, format } from "date-fns";
import { AnalyticsCards } from "@/components/ui/analytics-cards";
import { SalesChart } from "@/components/ui/sales-chart";
import { TopProductsChart } from "@/components/ui/top-products-chart";
import { LatestOrders } from "@/components/ui/latest-orders";
import { DateRangePicker } from "@/app/panel/satislar/_components/date-range-picker";

interface AnalyticsData {
  totalRevenue: number;
  totalSalesCount: number;
  pendingOrdersCount: number;
  newClientsCount: number;
  totalProductsCount: number;
  topProducts: Array<{
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  dailySales: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
}

export default function Panel() {
  // Initialize with today's date as default
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(today),
    to: endOfDay(today),
  });

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalSalesCount: 0,
    pendingOrdersCount: 0,
    newClientsCount: 0,
    totalProductsCount: 0,
    topProducts: [],
    dailySales: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!dateRange?.from || !dateRange?.to) {
        return;
      }

      setLoading(true);
      try {
        const startDate = format(dateRange.from, 'yyyy-MM-dd');
        const endDate = format(dateRange.to, 'yyyy-MM-dd');

        const response = await fetch(
          `/api/analytics?startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [dateRange]);

  return (
    <div className="min-h-screen flex flex-col gap-10 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-koli-red-dark">
          İşletme Özeti
        </h1>
        <DateRangePicker value={dateRange} onSelect={setDateRange} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Yükleniyor...</div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Top: Analytics Cards */}
          <AnalyticsCards
            totalRevenue={analytics.totalRevenue}
            totalSalesCount={analytics.totalSalesCount}
            pendingOrdersCount={analytics.pendingOrdersCount}
          />

          {/* Middle: Sales Chart */}
          <SalesChart 
            data={analytics.dailySales} 
            isHourly={
              dateRange?.from && dateRange?.to 
                ? dateRange.from.toDateString() === dateRange.to.toDateString()
                : false
            }
          />

          {/* Bottom: Pie Chart and Latest Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-1 h-full">
              <TopProductsChart products={analytics.topProducts} />
            </div>
            <div className="lg:col-span-2 h-full">
              <LatestOrders />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
