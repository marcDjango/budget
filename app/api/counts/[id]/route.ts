// Exemple d'API pour récupérer les comptes de l'utilisateur
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
  console.log("rerrerer", id)
    try {
      const accounts = await prisma.account.findMany({
        where: { userId:id },
      });
  
      return NextResponse.json(accounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  }
  