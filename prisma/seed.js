import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Créer des utilisateurs de test
  const user = await prisma.user.create({
    data: {
      name: "dev",
      email: "dev@gmail.com",
      password:"$2b$10$NoKgMmWa3lAyf.04DkTha.GuReRyhjxAxjFg4iRCf.urE57KcRNwe",
      role: "USER",
    },
  });

  // Créer des charges fixes de test avec les nouveaux champs
  await prisma.fixedExpense.createMany({
    data: [
      { 
        name: "Loyer", 
        amount: 1200, 
        category: "Logement", 
        userId: user.id,
        paid: false,
        paymentDate: new Date(2024, 8, 5), // 5 septembre 2024
        occurrence: "monthly"
      },
      { 
        name: "Électricité", 
        amount: 100, 
        category: "Services", 
        userId: user.id,
        paid: true, 
        paymentDate: new Date(2024, 8, 5), // 5 septembre 2024
        occurrence: "monthly"
      },
      { 
        name: "Internet", 
        amount: 50, 
        category: "Services", 
        userId: user.id,
        paid: false,
        paymentDate: new Date(2024, 8, 5), // 5 septembre 2024
        occurrence: "monthly"
      },
      { 
        name: "Assurance voiture", 
        amount: 150, 
        category: "Transports", 
        userId: user.id,
        paid: true,
        paymentDate: new Date(2024, 8, 5), // 5 septembre 2024
        occurrence: "every_2_months"
      },
      { 
        name: "Abonnement gym", 
        amount: 30, 
        category: "Santé", 
        userId: user.id,
        paid: false,
        paymentDate: new Date(2024, 8, 5), // 5 septembre 2024
        occurrence: "monthly"
      },
      { 
        name: "Streaming", 
        amount: 15, 
        category: "Loisirs", 
        userId: user.id,
        paid: true,
        paymentDate: new Date(2024, 8, 5), // 5 septembre 2024
        occurrence: "monthly"
      },
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
