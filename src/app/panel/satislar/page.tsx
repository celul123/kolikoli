import prisma from "@/lib/db";
import { CreateOrderDialog } from "./_components/create-order-dialog";
import { UpdateOrderDialog } from "./_components/update-order-dialog";
import Button from "@/components/ui/button1";
import DeleteButton from "./_components/delete-order-dialog";

export const STATES = {
  received: "Sipariş Alındı",
  completed: "Sipariş Tamamlandı",
  cancelled: "Sipariş İptal Edildi",
};

export default async function SatislarPage() {
  const orders = await prisma.order.findMany();
  const clients = await prisma.client.findMany();
  const products = await prisma.product.findMany();

  return (
    <div className="flex flex-col gap-10 p-10">
      <h1 className="text-4xl font-bold text-koli-red-dark">Satışlar</h1>
      <div className="flex justify-end">
        <CreateOrderDialog
          clients={clients}
          products={products.map((product) => ({
            id: product.id,
            name: product.name,
          }))}
        >
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
                {STATES[order.state]}
              </td>
              <td className="border border-separator p-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="border border-separator p-2">
                {new Date(order.updatedAt).toLocaleDateString()}
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
    </div>
  );
}
