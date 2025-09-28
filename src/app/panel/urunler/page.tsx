import prisma from "@/lib/db";
import { DialogDemo } from "./_components/create-product-dialog";
import Button from "@/components/ui/button1";
import DeleteButton from "./_components/delete-product-dialog";
import { UpdateProductDialog } from "./_components/update-product-dialog";

export default async function UrunlerPage() {
  const products = await prisma.product.findMany();

  return (
    <div className="flex flex-col gap-10 p-10">
      <h1 className="text-4xl font-bold text-koli-red-dark">Ürünler</h1>
      <div className="flex justify-end">
        <DialogDemo>
          <Button>Ürün Ekle</Button>
        </DialogDemo>
      </div>
      <table className="w-full border-separator">
        <thead>
          <tr>
            <th className="border border-separator p-2">Ad</th>
            <th className="border border-separator p-2">Fiyat</th>
            <th className="border border-separator p-2">Mevcut Stok</th>
            <th className="border border-separator p-2">Oluşturulma Tarihi</th>
            <th className="border border-separator p-2">Güncellenme Tarihi</th>
            <th className="border border-separator p-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border border-separator p-2">{product.name}</td>
              <td className="border border-separator p-2">
                {product.price.toString()}
              </td>
              <td className="border border-separator p-2">
                {product.stockQuantity}
              </td>
              <td className="border border-separator p-2">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
              <td className="border border-separator p-2">
                {new Date(product.updatedAt).toLocaleDateString()}
              </td>
              <th className="border border-separator p-2 opacity-70 space-x-2">
                <UpdateProductDialog
                  productData={{ ...product, price: Number(product.price) }}
                />
                <DeleteButton id={product.id} />
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
