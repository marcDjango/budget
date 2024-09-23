import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Méthode GET pour récupérer les dépenses d'un utilisateur spécifique
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  const {id} = params; // On récupère l'ID utilisateur depuis les paramètres de requête

  // Vérification si `userId` est fourni
  if (!id) {
    return new Response(
      JSON.stringify({ error: "Missing userId parameter" }),
      { status: 400 }
    );
  }

  try {
    // Récupérer toutes les dépenses pour cet utilisateur
    const userExpenses = await prisma.expense.findMany({
      where: { accountId:id },
    });

    return new Response(JSON.stringify({ userExpenses }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des dépenses." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
