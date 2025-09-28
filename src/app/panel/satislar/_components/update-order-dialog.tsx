"use client";

import { useForm, FieldValues, Controller } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pen } from "lucide-react";
import { STATES } from "../page";

export function UpdateOrderDialog({
  orderData,
}: {
  orderData: {
    id: number;
    state: string;
  };
}) {
  const [open, setOpen] = React.useState(false);
  const { handleSubmit, control } = useForm({
    defaultValues: {
      id: orderData.id,
      state: orderData.state,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await fetch(`/api/orderOperations/updateOrder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderData.id,
          state: data.state,
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

    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Pen className="hover:opacity-50 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Satışı Güncelleme</DialogTitle>
          <DialogDescription>* Zorunlu alanlar</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="state" className="text-left">
              Durum*
            </Label>
            <Controller
              control={control}
              name="state"
              render={({ field }) => (
                <Select onValueChange={field.onChange} {...field}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sipariş durumu seçin" />
                  </SelectTrigger>
                  <SelectContent color="orange">
                    {Object.keys(STATES).map((state) => (
                      <SelectItem key={state} value={state}>
                        {STATES[state]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
