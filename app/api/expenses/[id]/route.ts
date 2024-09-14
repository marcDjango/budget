import { PrismaClient } from "@prisma/client";
import type { NextRequest } from 'next/server';

const prisma = new PrismaClient();

// Gestion de la méthode PUT pour mettre à jour une charge
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { name, amount, category } = await req.json();

    if (!name || !amount || !category) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const updatedExpense = await prisma.fixedExpense.update({
      where: { id }, // ID en tant que string
      data: {
        name,
        amount: parseFloat(amount), // Assurez-vous que 'amount' est un nombre
        category,
      },
    });

    return new Response(JSON.stringify(updatedExpense), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    return new Response(JSON.stringify({ error: 'Error updating expense' }), { status: 500 });
  } finally {
    await prisma.$disconnect(); // Fermer l'instance Prisma
  }
}

// Gestion de la méthode DELETE pour supprimer une charge
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.fixedExpense.delete({
      where: { id }, // ID en tant que string
    });

    return new Response(JSON.stringify({ message: 'Expense deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return new Response(JSON.stringify({ error: 'Error deleting expense' }), { status: 500 });
  } finally {
    await prisma.$disconnect(); // Fermer l'instance Prisma
  }
}
