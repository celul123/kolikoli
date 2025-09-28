import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, price, stockQuantity } = body;

    if (!id) {
      return NextResponse.json({ error: "ID zorunlu" }, { status: 400 });
    }

    let stockQuantityNumber: number;
    try {
      stockQuantityNumber = parseInt(stockQuantity);
    } catch (error) {
      console.error(error);
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        stockQuantity: stockQuantityNumber,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Güncelleme başarısız" },
      { status: 500 }
    );
  }
}
