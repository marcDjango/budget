import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();

    // Vérification si un solde existe déjà pour cet utilisateur
    const existingBalance = await prisma.balance.findFirst({
      where: {
        userId: userId, // Recherche basée sur userId
      },
    });

    // Si un solde existe déjà, le mettre à jour
    if (existingBalance) {
      const updatedBalance = await prisma.balance.update({
        where: {
          id: existingBalance.id, // Utiliser l'ID unique de l'enregistrement existant
        },
        data: {
          amount: amount, // Mettre à jour le montant
        },
      });

      return NextResponse.json(updatedBalance);
    }

    // Sinon, créer un nouveau solde pour l'utilisateur
    const newBalance = await prisma.balance.create({
      data: {
        userId: userId, // Créer un nouveau solde avec l'userId
        amount: amount,
      },
    });

    return NextResponse.json(newBalance);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
