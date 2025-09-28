import prisma from "@/lib/db";
import { DialogDemo } from "./_components/create-client-dialog";
import Button from "@/components/ui/button1";
import DeleteButton from "./_components/delete-client-dialog";
import { UpdateClientDialog } from "./_components/update-client-dialog";

export default async function MusterilerPage() {
  const clients = await prisma.client.findMany();

  return (
    <div className="flex flex-col gap-10 p-10">
      <h1 className="text-4xl font-bold text-koli-red-dark">Müşteriler</h1>
      <div className="flex justify-end">
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
          {clients.map((client) => (
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
    </div>
  );
}
