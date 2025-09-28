import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Id eksik." }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id: Number(id) },
      include: {
        product: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Id hatali" }, { status: 400 });
    }


    await prisma.product.update({
      where: { id: order.productId },
      data: {
        stockQuantity: order.product.stockQuantity + order.quantity,
      },
    });

    await prisma.order.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Sipariş başarıyla silindi" });
  } catch (error) {
    console.error("Silme hatası:", error);
    return NextResponse.json({ error: "Sipariş silinemedi" }, { status: 500 });
  }
}
