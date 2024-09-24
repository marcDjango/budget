import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, amount, category, paid, paymentDate, occurrence, type, month, year, accountId } = await req.json();

    // Validation minimale
    if (!name || !amount || !category || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insertion de la nouvelle dépense dans la base de données
    const newExpense = await prisma.expense.create({
      data: {
        userId: session.user.id as string, // Assurez-vous que userId est une chaîne
        accountId: accountId,      // Assurez-vous que accountId est soit une chaîne soit null
        name: name as string,
        amount: parseFloat(amount),        // Convertir en Float si nécessaire
        category: category as string,
        paid: paid || false,               // Par défaut à false si non fourni
        paymentDate: paymentDate ? new Date(paymentDate) : null, // Convertir en Date si fourni
        occurrence: occurrence || null,
        type: type as 'FIXED' | 'MONTHLY', // Spécifiez le type explicitement
        month: month ? Number(month) : null, // Assurez-vous que c'est un nombre ou null
        year: year ? Number(year) : null,   // Assurez-vous que c'est un nombre ou null
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}