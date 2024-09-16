// app/api/update-payment-status/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Récupérer les données de la requête
    const { id, paid } = await req.json();

    // Valider les données
    if (!id || paid === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Trouver la charge fixe correspondante
    const expense = await prisma.fixedExpense.findUnique({
      where: { id },
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // Mettre à jour le statut du paiement
    const updatedExpense = await prisma.fixedExpense.update({
      where: { id },
      data: { paid },
    });

    return NextResponse.json(updatedExpense, { status: 200 });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json({ error: 'Error updating payment status' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
