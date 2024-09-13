import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Créer des utilisateurs de test
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "USER",
    },
  });

  // Créer des charges fixes de test
  await prisma.fixedExpense.createMany({
    data: [
      { name: "Loyer", amount: 1200, category: "Logement", userId: user.id },
      { name: "Électricité", amount: 100, category: "Services", userId: user.id },
      { name: "Internet", amount: 50, category: "Services", userId: user.id },
    ],
  });

  // Créer des dépenses mensuelles de test
  await prisma.monthlyExpense.create({
    data: {
      userId: user.id,
      month: new Date().getMonth() + 1, // Mois courant
      year: new Date().getFullYear(),   // Année courante
      amount: 1350, // Montant total des dépenses
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
