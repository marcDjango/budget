import { PrismaClient } from "@prisma/client";
import type { NextRequest } from 'next/server';

const prisma = new PrismaClient();

// Définition de la méthode GET pour récupérer les charges
export async function GET() {
  try {
    const fixedExpenses = await prisma.fixedExpense.findMany();
    const monthlyExpenses = await prisma.monthlyExpense.findMany();
    return new Response(JSON.stringify({ fixedExpenses, monthlyExpenses }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur lors de la récupération des données." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Définition de la méthode POST pour ajouter une nouvelle charge
export async function POST(req: NextRequest) {
  try {
    const { name, amount, category, userId } = await req.json();
    if (!name || !amount || !category || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const newExpense = await prisma.fixedExpense.create({
      data: {
        name,
        amount: parseFloat(amount),
        category,
        user: {
          connect: { id: userId }, // Utilisation de l'objet attendu par Prisma
        },
      },
    });

    return new Response(JSON.stringify(newExpense), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error creating expense' }), { status: 500 });
  }
}
