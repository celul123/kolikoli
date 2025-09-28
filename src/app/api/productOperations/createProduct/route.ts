import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price, stockQuantity } = body;

  let stockQuantityNumber: number;
  try {
    stockQuantityNumber = parseInt(stockQuantity);
  } catch (error) {
    console.error(error);
    return;
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        stockQuantity: stockQuantityNumber,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
