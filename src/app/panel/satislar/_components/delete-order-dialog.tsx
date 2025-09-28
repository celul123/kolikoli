"use client";

import Button from "@/components/ui/button1";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import React from "react";

const DeleteButton = ({ id }: { id: number }) => {
  const [open, setOpen] = React.useState(false);

  async function deleteOrder() {
    console.log(id);
    try {
      const res = await fetch("/api/orderOperations/deleteOrder", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Silme işlemi başarısız");
      }

      const data = await res.json();
      console.log("Silme başarılı:", data);

      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Trash2 className="hover:opacity-50 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Siparişi Sil</DialogTitle>
        </DialogHeader>
        <p>
          Bu sipariş kaydını silmek istediğinize emin misiniz? Bu işlem geri
          alınamaz.
        </p>
        <DialogFooter>
          <Button type="submit" onClick={deleteOrder}>
            Sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
