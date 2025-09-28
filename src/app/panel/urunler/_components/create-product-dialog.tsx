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
import React from "react";

export function DialogDemo({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const onSubmit = async (data: FieldValues) => {
    await fetch("/api/productOperations/createProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        price: data.price,
        stockQuantity: data.stockQuantity,
      }),
    });

    reset();
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Ürün</DialogTitle>
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
            <Button type="submit">Kaydet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
