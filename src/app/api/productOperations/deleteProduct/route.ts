import { NextResponse } from "next/server";
import prisma from "@/lib/db"; 


export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body; 

    if (!id) {
      return NextResponse.json({ error: "ID eksik" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    console.error("Silme hatası:", error);
    return NextResponse.json({ error: "Ürün silinemedi" }, { status: 500 });
  }
}