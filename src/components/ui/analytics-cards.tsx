import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CreditCard, Activity, Clock } from "lucide-react"

interface AnalyticsCardsProps {
  totalRevenue: number;
  totalSalesCount: number;
  pendingOrdersCount: number;
}

export function AnalyticsCards({
  totalRevenue,
  totalSalesCount,
  pendingOrdersCount,
}: AnalyticsCardsProps) {
  // Format currency in Turkish Lira
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  return (
    <div className="grid grid-cols-3 gap-5">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescription>Toplam Gelir</CardDescription>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totalRevenue)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescription>Toplam Satış</CardDescription>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(totalSalesCount)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescription>Bekleyen Siparişler</CardDescription>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(pendingOrdersCount)}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
