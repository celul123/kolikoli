"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface Order {
  id: number;
  clientName: string;
  productName: string;
  quantity: number;
  state: string;
  createdAt: string;
  product: {
    price: number;
  };
}

interface LatestOrdersProps {
  refreshTrigger?: number;
}

export function LatestOrders({ refreshTrigger }: LatestOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const response = await fetch(`/api/latestOrders?page=${currentPage}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching latest orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [currentPage, refreshTrigger]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStateLabel = (state: string) => {
    const stateMap: Record<string, string> = {
      waiting: "Bekliyor",
      completed: "Tamamlandı",
      cancelled: "İptal Edildi",
    };
    return stateMap[state] || state;
  };

  const getStateBadgeClass = (state: string) => {
    const classMap: Record<string, string> = {
      waiting: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return classMap[state] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Son Siparişler</CardTitle>
        <CardDescription>En son eklenen siparişler</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Müşteri</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ürün</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Miktar</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Toplam</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Durum</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3 px-4"><Skeleton className="h-4 w-[120px]" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-[150px]" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-[40px]" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-[80px]" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-6 w-[100px] rounded-full" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-[140px]" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">
              Henüz sipariş yok
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Müşteri
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Ürün
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Miktar
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Toplam
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Durum
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Tarih
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{order.clientName}</td>
                      <td className="py-3 px-4">{order.productName}</td>
                      <td className="py-3 px-4">{order.quantity}</td>
                      <td className="py-3 px-4">
                        {formatCurrency(order.product.price * order.quantity)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStateBadgeClass(
                            order.state
                          )}`}
                        >
                          {getStateLabel(order.state)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {format(
                          new Date(order.createdAt),
                          "dd MMM yyyy, HH:mm",
                          { locale: tr }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
