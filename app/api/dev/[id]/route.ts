import { expenseService } from "@/app/(protected)/dev/_services/expenseService";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Méthode GET pour récupérer les dépenses d'un compte spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Vérification si `accountId` est fourni
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing userId parameter" }), {
      status: 400,
    });
  }

  try {
    // Récupérer toutes les dépenses pour cet utilisateur
    const userExpenses = await prisma.expense.findMany({
      where: { accountId: id },
    });

    return new Response(JSON.stringify({ userExpenses }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des dépenses:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des dépenses." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Méthode PUT pour mettre à jour une dépense spécifique
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expenseId = params.id;
  const body = await req.json();
  const {
    accountId,
    name,
    amount,
    category,
    paid,
    paymentDate,
    occurrence,
    type,
    month,
    year,
  } = body;

  // Validation des données requises
  if (!name || !amount) {
    return NextResponse.json(
      { error: "Name and amount are required fields" },
      { status: 400 }
    );
  }

  try {
    // Mise à jour de la dépense
    const updatedExpense = await expenseService.updateExpense(expenseId, {
      userId: session.user.id,
      accountId,
      name,
      amount: parseFloat(amount),
      category,
      paid: !!paid,
      paymentDate: paymentDate ? new Date(paymentDate) : null,
      occurrence: occurrence || null,
      type,
      month: month || null,
      year: year || null,
    });

    console.log("Updated Expense:", updatedExpense);

    return NextResponse.json(updatedExpense, { status: 200 });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Error updating expense" },
      { status: 500 }
    );
  }
}

// Méthode DELETE pour supprimer une charge spécifique
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Suppression de la dépense
    await prisma.expense.delete({
      where: { id }, // ID en tant que string
    });

    return new Response(JSON.stringify({ message: "Expense deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return new Response(JSON.stringify({ error: "Error deleting expense" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect(); // Fermer l'instance Prisma pour éviter les fuites de connexion
  }
}
