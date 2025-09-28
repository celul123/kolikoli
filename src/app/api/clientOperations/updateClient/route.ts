import { NextResponse } from "next/server";
import prisma from "@/lib/db"; 

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, phone, address } = body;

    if (!id) {
      return NextResponse.json({ error: "ID zorunlu" }, { status: 400 });
    }

    const updatedClient = await prisma.client.update({
      where: { id: Number(id) },
      data: {
        name,
        phone,
        address,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
