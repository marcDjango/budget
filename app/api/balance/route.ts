import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, amount, accountId } = await req.json();

    // Créer un nouveau solde pour l'utilisateur
    const newBalance = await prisma.balance.create({
      data: {
        userId: userId,
        amount: amount,
        accountId: accountId, // Utilisez l'ID du compte existant
      },
    });

    return NextResponse.json(newBalance);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
