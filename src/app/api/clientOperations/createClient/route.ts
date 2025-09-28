import  prisma from '@/lib/db'; 
import { NextResponse } from 'next/server';



export async function POST(request: Request) {
  const body = await request.json();
  const { name, phone, address } = body;

  try {
    const client = await prisma.client.create({
      data: {
        name,
        phone,
        address,
      },
    });
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const clients = await prisma.client.findMany();
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

