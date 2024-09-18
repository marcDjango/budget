import { PrismaClient } from "@prisma/client";
import { log } from "console";
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Récupérer le solde spécifique par ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
console.log(id);

  const balance = await prisma.balance.findFirst({
    where: { userId:id },
  });

  if (!balance) {
    return NextResponse.json({ error: 'Balance not found' }, { status: 404 });
  }

  return NextResponse.json({ balance });
}

// PUT: Mettre à jour un solde par ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { amount } = await req.json();

  const updatedBalance = await prisma.balance.update({
    where: { id },
    data: { amount },
  });

  return NextResponse.json({ updatedBalance });
}

// DELETE: Supprimer un solde par ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  await prisma.balance.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Balance deleted successfully' });
}


