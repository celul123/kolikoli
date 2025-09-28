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

export function UpdateProductDialog({
  productData,
}: {
  productData: {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
  };
}) {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: productData.name,
      price: productData.price.toString(),
      stockQuantity: productData.stockQuantity,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await fetch(`/api/productOperations/updateProduct`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: productData.id,
          name: data.name,
          price: data.price,
          stockQuantity: data.stockQuantity,
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
          <DialogTitle>Ürün Güncelle</DialogTitle>
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
            <Label htmlFor="price" className="text-right">
              Fiyat*
            </Label>
            <Input
              {...register("price", { required: true })}
              id="price"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stockQuantity" className="text-left">
              Mevcut Stok*
            </Label>
            <Input
              {...register("stockQuantity", { required: true })}
              id="stockQuantity"
              className="col-span-3"
              type="number"
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
