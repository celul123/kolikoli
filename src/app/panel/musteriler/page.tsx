import prisma from "@/lib/db";
import { DialogDemo } from "./_components/create-client-dialog";
import Button from "@/components/ui/button1";
import DeleteButton from "./_components/delete-client-dialog";
import { UpdateClientDialog } from "./_components/update-client-dialog";
import { FilterBar } from "./_components/filter-bar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

export default async function MusterilerPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
  };
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const searchQuery = resolvedSearchParams?.query?.trim() || "";

   // Dinamik where şartı oluştur (Sadece ürün adına göre ara)
  const where = searchQuery
    ? {
        name: {
          contains: searchQuery,
        },
      }
    : undefined;

  // Veri çekme (where şartını hem findMany hem count'a uygula)
  const [clients, totalClients] = await Promise.all([
    prisma.client.findMany({
      where, // where şartını burada kullan
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.client.count({
      where, // where şartını burada da kullan
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalClients / ITEMS_PER_PAGE));

  // ---- SERILESTIR: Server -> Client geçerken sadece düz JS objesi gönder
  // UpdateProductDialog gibi Client Component'lere göndermeden önce veriyi düz objeye çevir
  const serializedClients = clients.map((client) => ({
    id: client.id,
    name: client.name,
    phone: toPlainNumberOrString(client.phone), // Decimal -> number/string
    address: toPlainNumberOrString(client.address), // Decimal -> number/string
    // Tarihleri Client Component'e (UpdateOrderDialog) gönderebilmek için ISO string'e çevir
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  }));

  // helper: URL param string kısmı — pagination link'lerinde tekrar kullanacağız
  const paramsFragment = (page?: number) => {
    const p = page ?? currentPage;
    const parts: string[] = [`page=${p}`];
    if (searchQuery) parts.push(`query=${encodeURIComponent(searchQuery)}`);
    return parts.join("&");
  };


  return (
    <div className="flex flex-col gap-10 p-10">
      <h1 className="text-4xl font-bold text-koli-red-dark">Müşteriler</h1>
      <div className="flex justify-between items-center">
        <FilterBar/>
        <DialogDemo>
          <Button>Müşteri Ekle</Button>
        </DialogDemo>
      </div>
      <table className="w-full border-separator">
        <thead>
          <tr>
            <th className="border border-separator p-2">Ad</th>
            <th className="border border-separator p-2">Telefon</th>
            <th className="border border-separator p-2">Adres</th>
            <th className="border border-separator p-2">Oluşturulma Tarihi</th>
            <th className="border border-separator p-2">Güncellenme Tarihi</th>
            <th className="border border-separator p-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {serializedClients.map((client) => (
            <tr key={client.id}>
              <td className="border border-separator p-2">{client.name}</td>
              <td className="border border-separator p-2">{client.phone}</td>
              <td className="border border-separator p-2">{client.address}</td>
              <td className="border border-separator p-2">
                {new Date(client.createdAt).toLocaleDateString()}
              </td>
              <td className="border border-separator p-2">
                {new Date(client.updatedAt).toLocaleDateString()}
              </td>
              <th className="border border-separator p-2 opacity-70 space-x-2">
                <UpdateClientDialog clientData={client} />
                <DeleteButton id={client.id} />
              </th>
            </tr>
          ))}
        </tbody>
      </table>

   {/* Pagination */}
      <div className="mx-auto flex justify-center pointer-events-auto">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`/panel/urunler?${paramsFragment(currentPage - 1)}`}
                />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`/panel/urunler?${paramsFragment(page)}`}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={`/panel/urunler?${paramsFragment(currentPage + 1)}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
