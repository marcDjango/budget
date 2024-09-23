import { PrismaClient } from "@prisma/client";
import { log } from "console";
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Récupérer le solde spécifique par ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const balance = await prisma.balance.findMany({
      where: { accountId:id },
    });

    // Si le solde n'existe pas, renvoyer exists: false
    if (!balance) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    // Si le solde existe, renvoyer exists: true et les détails du solde
    return NextResponse.json({ exists: true, balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
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


