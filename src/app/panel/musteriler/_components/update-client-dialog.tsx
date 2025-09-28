"use client";

import { useForm, FieldValues } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/components/ui/button1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Pen } from "lucide-react";
import React from "react";

export function UpdateClientDialog({
  clientData,
}: {
  clientData: {
    id: number;
    name: string;
    phone: string | null;
    address: string | null;
  };
}) {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: clientData.name,
      phone: clientData.phone,
      address: clientData.address,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await fetch(`/api/clientOperations/updateClient`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: clientData.id,
          name: data.name,
          phone: data.phone,
          address: data.address,
        }),
      });

      if (!res.ok) {
        throw new Error("Güncelleme başarısız");
      }

      router.refresh();
    } catch (error) {
      console.error("Hata:", error);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Pen className="hover:opacity-50 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Müşteri Güncelle</DialogTitle>
          <DialogDescription>* Zorunlu alanlar</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Ad*
            </Label>
            <Input
              {...register("name", { required: true })}
              id="name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Telefon
            </Label>
            <Input {...register("phone")} id="phone" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Adres
            </Label>
            <Input
              {...register("address")}
              id="address"
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Güncelle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
