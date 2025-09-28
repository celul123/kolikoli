import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const data = await req.json();
  const { name, quantity, clientName } = data;

  const product = await prisma.product.findFirst({
    where: { name },
  });

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  const client = await prisma.client.findFirst({
    where: { name: clientName },
  });

  if (!client) {
    return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 });
  }

  // Stok işlemleri

  if (product.stockQuantity < quantity) {
    return NextResponse.json({ error: "Yetersiz stok" }, { status: 400 });
  }
  await prisma.product.update({
    where: { id: product.id },
    data: {
      stockQuantity: product.stockQuantity - quantity,
    },
  });

  // if (state === "cancelled") {
  //   await prisma.product.update({
  //     where: { id: product.id },
  //     data: {
  //       stockQuantity: product.stockQuantity + quantity,
  //     },
  //   });
  // }

  // Siparişi veritabanına ekle
  await prisma.order.create({
    data: {
      productName: name,
      clientName,
      quantity,
      state: "received",
      productId: product.id,
      clientId: client.id,
    },
  });

  return NextResponse.json({ success: true });
}
