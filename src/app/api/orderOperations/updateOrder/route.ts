import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, state } = data;

    // Mevcut siparişi bul
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: { product: true }, // ürün bilgilerini de getir
    });


    if (!order) {
      return NextResponse.json(
        { error: "Sipariş bulunamadı" },
        { status: 404 }
      );
    }


    if(order.state === "cancelled"){
      return NextResponse.json(
        { error: "İptal edilen siparişi güncelleyemezsin" },
        { status: 400 }
      );
    }

    const product = order.product;

    // Miktar güncelleme gerekiyorsa stok işlemleri
    if (state === "cancelled") {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          stockQuantity: product.stockQuantity + order.quantity,
        },
      });
    }

    // Siparişi güncelle
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        state: state ?? order.state,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
