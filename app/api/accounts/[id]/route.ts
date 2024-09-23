import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session'; // Assurez-vous que l'import est correct

const prisma = new PrismaClient();

const getAccountsByUserId = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  // Récupérer la session pour s'assurer que l'utilisateur est authentifié
  const session = await getSession(); // Utilisez les options d'authentification ici

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id }, // Récupérer les comptes associés à l'utilisateur connecté
    });

    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    console.error(error); // Afficher l'erreur dans la console pour le débogage
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export { getAccountsByUserId as GET }; // Exporter la fonction pour la méthode GET
