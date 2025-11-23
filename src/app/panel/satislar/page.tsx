import prisma from "@/lib/db";
import { CreateOrderDialog } from "./_components/create-order-dialog";
import { UpdateOrderDialog } from "./_components/update-order-dialog";
import Button from "@/components/ui/button1";
import DeleteButton from "./_components/delete-order-dialog";
import { FilterBar } from "./_components/filter-bar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const STATES = {
  received: "Sipariş Alındı",
  completed: "Sipariş Tamamlandı",
  cancelled: "Sipariş İptal Edildi",
} as const;

const ITEMS_PER_PAGE = 12;

// yardımcı: Decimal veya özel nesneleri düz JS tiplerine dönüştür
function toPlainNumberOrString(
  value: unknown
): number | string | null | undefined {
  if (value == null) return value as null | undefined;

  // Eğer objede toNumber fonksiyonu varsa kullanmaya çalış
  if (typeof value === "object" && value !== null) {
    const v = value as { toNumber?: () => number };
    if (typeof v.toNumber === "function") {
      try {
        return v.toNumber();
      } catch {
        return String(value);
      }
    }
  }

  if (typeof value === "number" || typeof value === "string") return value;
  // fallback olarak string'e çevir
  return String(value);
}

export default async function SatislarPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
    start?: string;
    end?: string;
  };
}) {
  const resolvedSearchParams = searchParams ?? {};
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const searchQuery = resolvedSearchParams?.query?.trim() || "";
  const startDateStr = resolvedSearchParams?.start || "";
  const endDateStr = resolvedSearchParams?.end || "";

  // Tarihleri Date nesnesine çevir (end inclusive: 23:59:59.999)
  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr
    ? new Date(new Date(endDateStr).setHours(23, 59, 59, 999))
    : null;

  // Dinamik where şartı oluştur
  const andClauses: Array<Record<string, unknown>> = [];

  if (searchQuery) {
    const nameFilters: Array<Record<string, unknown>> = [
      { product: { name: { contains: searchQuery } } },
      { client: { name: { contains: searchQuery } } },
      { productName: { contains: searchQuery } },
      { clientName: { contains: searchQuery } },
    ];
    andClauses.push({ OR: nameFilters });
  }

  if (startDate) {
    andClauses.push({ createdAt: { gte: startDate } });
  }
  if (endDate) {
    andClauses.push({ createdAt: { lte: endDate } });
  }

  const where = andClauses.length > 0 ? { AND: andClauses } : undefined;

  // Veri çekme
  const [rawOrders, rawTotalOrders, rawClients, rawProducts] =
    (await Promise.all([
      prisma.order.findMany({
        where,
        take: ITEMS_PER_PAGE,
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          product: true,
          client: true,
        },
      }),

      prisma.order.count({
        where,
      }),

      prisma.client.findMany(),
      prisma.product.findMany(),
    ])) as [unknown[], number, unknown[], unknown[]];

  // ---- SERILESTIR: Server -> Client geçerken sadece düz JS objesi gönder

  // Siparişleri serileştir (Tabloda göstermek ve UpdateOrderDialog'a göndermek için)
  const orders = (rawOrders as unknown[]).map((o) => {
    const oo = o as Record<string, unknown>;
    return {
      id: Number(oo.id),
      productId: oo.productId != null ? Number(oo.productId) : null,
      productName:
        (oo.product && (oo.product as Record<string, unknown>).name) ??
        oo.productName ??
        null,
      clientId: oo.clientId != null ? Number(oo.clientId) : null,
      clientName:
        (oo.client && (oo.client as Record<string, unknown>).name) ??
        oo.clientName ??
        null,
      quantity: toPlainNumberOrString(oo.quantity),
      state: oo.state ?? null,
      // Tarihleri Client Component'e (UpdateOrderDialog) gönderebilmek için ISO string'e çevir
      createdAt: oo.createdAt
        ? new Date(oo.createdAt as string | Date).toISOString()
        : null,
      updatedAt: oo.updatedAt
        ? new Date(oo.updatedAt as string | Date).toISOString()
        : null,
    };
  });

  // Sadece CreateOrderDialog için gereken Müşteri verilerini serileştir
  const dialogClients = (rawClients as unknown[]).map((c) => {
    const cc = c as Record<string, unknown>;
    return {
      id: Number(cc.id),
      name: cc.name ? String(cc.name) : "",
      address: cc.address != null ? String(cc.address) : null,
      phone: cc.phone != null ? String(cc.phone) : null,
    };
  });

  // Sadece CreateOrderDialog için gereken Ürün verilerini serileştir
  const dialogProducts = (rawProducts as unknown[]).map((p) => {
    const pp = p as Record<string, unknown>;
    return {
      id: Number(pp.id),
      name: pp.name ? String(pp.name) : "",
      price: toPlainNumberOrString(pp.price),
    };
  });

  const totalOrders = rawTotalOrders;
  const totalPages = Math.max(1, Math.ceil(totalOrders / ITEMS_PER_PAGE));

  // helper: URL param string kısmı — pagination link'lerinde tekrar kullanacağız
  const paramsFragment = (page?: number) => {
    const p = page ?? currentPage;
    const parts: string[] = [`page=${p}`];
    if (searchQuery) parts.push(`query=${encodeURIComponent(searchQuery)}`);
    if (startDateStr) parts.push(`start=${encodeURIComponent(startDateStr)}`);
    if (endDateStr) parts.push(`end=${encodeURIComponent(endDateStr)}`);
    return parts.join("&");
  };

  return (
    <div className="flex flex-col gap-10 p-10">
      <h1 className="text-4xl font-bold text-koli-red-dark">Satışlar</h1>

      {/* Arama formu: text + iki tarih input */}
      <div className="flex justify-between items-center">
        {/* The new client component handles all filter state */}
        <FilterBar />

        <CreateOrderDialog clients={dialogClients} products={dialogProducts}>
          <Button>Satış Ekle</Button>
        </CreateOrderDialog>
      </div>

      <table className="w-full border-separator">
        <thead>
          <tr>
            <th className="border border-separator p-2">Ürün</th>
            <th className="border border-separator p-2">Satış Miktarı</th>
            <th className="border border-separator p-2">Müşteri</th>
            <th className="border border-separator p-2">Mevcut Durum</th>
            <th className="border border-separator p-2">Oluşturulma Tarihi</th>
            <th className="border border-separator p-2">Güncellenme Tarihi</th>
            <th className="border border-separator p-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border border-separator p-2">
                {order.productName}
              </td>
              <td className="border border-separator p-2">{order.quantity}</td>
              <td className="border border-separator p-2">
                {order.clientName}
              </td>
              <td className="border border-separator p-2">
                {(STATES as Record<string, string>)[String(order.state)] ??
                  String(order.state ?? "-")}
              </td>
              <td className="border border-separator p-2">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </td>
              <td className="border border-separator p-2">
                {order.updatedAt
                  ? new Date(order.updatedAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </td>
              <th className="border border-separator p-2 opacity-70 space-x-2">
                {order.state === "cancelled" ? null : (
                  <UpdateOrderDialog orderData={order} />
                )}
                <DeleteButton id={order.id} />
              </th>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mx-auto flex justify-center pointer-events-auto">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`/panel/satislar?${paramsFragment(currentPage - 1)}`}
                />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`/panel/satislar?${paramsFragment(page)}`}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={`/panel/satislar?${paramsFragment(currentPage + 1)}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
